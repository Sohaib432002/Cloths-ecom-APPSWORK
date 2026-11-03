import { InferenceClient } from '@huggingface/inference'
import { getCatalog, searchCatalog, toCard } from '@/lib/catalog'
import { listCoupons } from '@/lib/commerce/coupons'
import { getOrderById } from '@/lib/commerce/orders'
import { DELIVERY_FEE, FREE_SHIPPING_THRESHOLD } from '@/lib/commerce/pricing'
import { getHuggingFaceConfig } from '@/lib/env'
import { logEvent } from '@/lib/http'
import { stripeEnabled } from '@/lib/payments/stripe'
import { SITE } from '@/lib/site'
import { inferIntent, matchProducts } from './stylist'
import type { SessionUser } from '@/types/product'

type Turn = { role: 'user' | 'assistant'; content: string }

const has = (text: string, words: string[]) => words.some((word) => text.includes(word))

const TYPE_WORDS: [RegExp, string][] = [
  [/\b(shoes?|sneakers?|trainers?|footwear|running)\b/, 'Sneakers'],
  [/\b(caps?|hats?)\b/, 'Caps'],
  [/\b(bags?|handbags?|backpacks?|purse)\b/, 'Bags'],
  [/\b(jeans?|denim)\b/, 'Jeans'],
  [/\b(hoodies?|sweatshirts?)\b/, 'Hoodie'],
  [/\b(jackets?|coats?|blazers?)\b/, 'Jackets'],
  [/\b(polos?)\b/, 'Polo Shirts'],
  [/\b(shirts?|t-?shirts?|tees?)\b/, 'Shirts'],
]

const STOP = new Set(
  'a an the i me my we you your is are am do does can could would will to for of in on at with and or any some show find looking look want need get buy please have has there which what whats under below less than over above around about cheap best good nice new latest something anything something help me us it its'.split(' ')
)

function knowledge(coupons: { code: string; description: string }[]) {
  return {
    shipping: `Standard delivery costs $${DELIVERY_FEE}. Orders of $${FREE_SHIPPING_THRESHOLD} or more ship free, and the code FREESHIP waives the delivery fee on any order.`,
    returns:
      'If something does not fit or is not as expected, message us with your order number and we will arrange a return or exchange. Items should be unworn and in original condition.',
    payment: stripeEnabled()
      ? 'You can pay by card (Visa or Mastercard on a secure Stripe page) or Cash on Delivery.'
      : 'You can pay with Cash on Delivery. Card payments are being activated.',
    coupons: coupons.length
      ? `Active codes: ${coupons.map((coupon) => `${coupon.code} (${coupon.description})`).join(' ')}`
      : 'There are no active coupon codes right now.',
    contact: `You can reach a real person by WhatsApp or phone on ${SITE.phoneDisplay}, or by email at ${SITE.email}.`,
    account: 'Use Sign in at the top of the page. New here? Create an account to save your wishlist and see your orders. Forgot your password? Use the reset link on the sign-in page.',
    track: 'Open Track order from the footer, or send me your order number (like ORD-ABC123) together with the email you ordered with and I will check it for you.',
  }
}

async function findProducts(text: string) {
  const budget = /(?:under|below|less than|max(?:imum)?|within)\s*\$?\s*(\d+)/.exec(text)
  const category = has(text, ['women', 'woman', 'ladies', 'girl'])
    ? 'Womens'
    : has(text, ['kid', 'child', 'boy'])
      ? 'Children'
      : /\bmen\b|\bman\b|\bmens\b|\bgents?\b/.test(text)
        ? 'Mens'
        : undefined
  const type = TYPE_WORDS.find(([pattern]) => pattern.test(text))?.[1]
  const sale = has(text, ['sale', 'discount', 'offer', 'deal'])
  const keywords = text
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !STOP.has(word) && !/^\d+$/.test(word))
    .filter((word) => !TYPE_WORDS.some(([pattern]) => pattern.test(word)))
    .filter((word) => !['women', 'woman', 'men', 'mens', 'kids', 'kid', 'girl', 'boy', 'sale', 'discount', 'offer', 'deal', 'ladies'].includes(word))
    .slice(0, 3)

  const base = {
    category,
    type,
    sale,
    maxPrice: budget ? Number(budget[1]) : undefined,
    limit: 4,
    sort: 'rating' as const,
  }
  let result = await searchCatalog({ ...base, search: keywords.join(' ') || undefined })
  if (!result.items.length && keywords.length) result = await searchCatalog({ ...base })
  // e.g. "bag for women": bags live under Accessories, so drop the category before giving up
  if (!result.items.length && category) result = await searchCatalog({ ...base, category: undefined, search: keywords.join(' ') || undefined })
  return { items: result.items, budget: base.maxPrice }
}

async function llmRewrite(system: string, history: Turn[], message: string) {
  const { token, model } = getHuggingFaceConfig()
  if (!token) return null
  try {
    const client = new InferenceClient(token)
    const response = await client.chatCompletion({
      model,
      messages: [{ role: 'system', content: system }, ...history.slice(-6), { role: 'user', content: message }],
      max_tokens: 260,
      temperature: 0.3,
    })
    return response.choices[0]?.message?.content?.trim() || null
  } catch (error) {
    logEvent('assistant.llm_fallback', { reason: error instanceof Error ? error.message : 'unknown' })
    return null
  }
}

export async function runAssistant(input: { message: string; history?: Turn[] }, user: SessionUser | null) {
  const raw = input.message.trim()
  const text = raw.toLowerCase()
  const coupons = await listCoupons()
  const facts = knowledge(coupons)

  let reply = ''
  let products: ReturnType<typeof toCard>[] = []
  let provider = 'rules'

  const orderId = /ord-[a-z0-9]{6}/i.exec(raw)?.[0].toUpperCase()
  const emailInText = /[^\s@]+@[^\s@]+\.[^\s@]+/.exec(raw)?.[0].toLowerCase()

  if (orderId) {
    const order = await getOrderById(orderId)
    const proof = emailInText || user?.email.toLowerCase()
    if (!proof) {
      reply = `I can check ${orderId} for you. Please send the email address you used to place it, so I can confirm it is yours.`
    } else if (!order || order.email?.toLowerCase() !== proof) {
      reply = `I could not find order ${orderId} for that email. Please check both and try again, or message us on WhatsApp at ${SITE.phoneDisplay}.`
    } else {
      reply = `Order ${order.id} is ${order.status.toLowerCase()}. Payment: ${order.payment}, ${order.paymentStatus?.toLowerCase()}. Total $${order.total.toFixed(2)} for ${order.items.length} item${order.items.length === 1 ? '' : 's'}, delivering to ${order.address.city}.`
    }
  } else if (has(text, ['hello', 'hi ', 'hey', 'salam', 'assalam']) && text.length < 25) {
    reply = 'Hello, welcome to Véora! I can help you find products, check an order, or answer questions about delivery, returns, payment and offers. What are you looking for?'
  } else if (has(text, ['ship', 'deliver', 'delivery', 'dispatch', 'how long'])) {
    reply = facts.shipping
  } else if (has(text, ['return', 'exchange', 'refund', 'wrong size', "doesn't fit", 'does not fit'])) {
    reply = facts.returns
  } else if (has(text, ['pay', 'cash on delivery', 'cod', 'card', 'visa', 'mastercard', 'checkout'])) {
    reply = facts.payment
  } else if (has(text, ['coupon', 'promo', 'voucher', 'discount code', 'code'])) {
    reply = facts.coupons
  } else if (has(text, ['call', 'phone', 'whatsapp', 'contact', 'human', 'agent', 'support', 'talk to', 'speak to', 'email'])) {
    reply = facts.contact
  } else if (has(text, ['track', 'where is my order', 'order status'])) {
    reply = facts.track
  } else if (has(text, ['login', 'log in', 'sign in', 'signup', 'sign up', 'account', 'password'])) {
    reply = facts.account
  } else if (has(text, ['wear', 'outfit', 'occasion', 'wedding', 'party', 'interview', 'office', 'date night', 'gym', 'look for'])) {
    const intent = inferIntent(raw)
    products = await matchProducts(intent, undefined, 12)
    products = products.filter((item) => intent.category === 'Children' || item.category !== 'Children').slice(0, 4)
    reply = intent.advice
  } else {
    const found = await findProducts(text)
    products = found.items.map(toCard)
    if (products.length) {
      reply = `Here ${products.length === 1 ? 'is a match' : 'are some matches'}${found.budget ? ` under $${found.budget}` : ''}. Tap one to see sizes and colours.`
    } else {
      const fallback = await getCatalog()
      products = fallback
        .filter((item) => item.isBestseller)
        .slice(0, 4)
        .map(toCard)
      reply = `I could not find an exact match, but these are our best sellers. You can also tell me a category (women, men, footwear, accessories), a budget or an occasion, or message a person on WhatsApp at ${SITE.phoneDisplay}.`
    }
  }

  // With an API token the same facts are phrased conversationally; without one the rule-based answer is used.
  const system = `You are the shopping assistant of Véora, a fashion store. Answer in the customer's language, in at most 70 words, warm and professional.
Use ONLY these facts; never invent prices, policies, stock or order details. If you do not know, offer WhatsApp ${SITE.phoneDisplay}.
Draft answer: ${reply}
Store facts: ${JSON.stringify(facts)}
Products shown to the customer: ${products.map((p) => `${p.title} ($${p.price})`).join('; ') || 'none'}`
  const polished = await llmRewrite(system, input.history || [], raw)
  if (polished) {
    reply = polished
    provider = getHuggingFaceConfig().model
  }

  return { reply, products, provider }
}
