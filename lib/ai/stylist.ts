import { InferenceClient } from '@huggingface/inference'
import { getCatalog, getProductBySlug, toCard } from '@/lib/catalog'
import { getHuggingFaceConfig } from '@/lib/env'
import { logEvent } from '@/lib/http'
import type { Product } from '@/types/product'

export type StylistMessage = {
  role: 'user' | 'assistant'
  content: string
}

export type StylistIntent = {
  occasion?: string
  style?: string
  category?: string
  type?: string
  colors?: string[]
  budget?: 'low' | 'mid' | 'high'
  advice: string
}

const STYLE_VALUES = ['Casual', 'Formal', 'Party', 'Gym'] as const
const CATEGORY_VALUES = ['Mens', 'Womens', 'Children', 'Accessories'] as const
const TYPE_VALUES = ['Jeans', 'Shirts', 'Hoodie', 'Polo Shirts', 'Jackets'] as const
const COLOR_VALUES = ['Black', 'Gray', 'White'] as const

function includesAny(text: string, words: string[]) {
  return words.some((word) => text.includes(word))
}

export function inferIntent(message: string, occasion?: string): StylistIntent {
  const text = `${occasion || ''} ${message}`.toLowerCase()

  const style = includesAny(text, ['gym', 'workout', 'training', 'athletic'])
    ? 'Gym'
    : includesAny(text, ['party', 'night out', 'club', 'celebration'])
      ? 'Party'
      : includesAny(text, ['office', 'work', 'wedding', 'formal', 'interview', 'business'])
        ? 'Formal'
        : 'Casual'

  const category = includesAny(text, ['kid', 'child', 'children', 'boy', 'girl'])
    ? 'Children'
    : includesAny(text, ['women', 'woman', 'female', 'ladies'])
      ? 'Womens'
      : includesAny(text, ['men', 'man', 'male', 'gents'])
        ? 'Mens'
        : undefined

  const type = includesAny(text, ['jean', 'denim'])
    ? 'Jeans'
    : includesAny(text, ['hoodie', 'sweatshirt'])
      ? 'Hoodie'
      : includesAny(text, ['jacket', 'coat', 'blazer'])
        ? 'Jackets'
        : includesAny(text, ['polo'])
          ? 'Polo Shirts'
          : includesAny(text, ['shirt'])
            ? 'Shirts'
            : undefined

  const colors = COLOR_VALUES.filter((color) => text.includes(color.toLowerCase()))
  const budget = includesAny(text, ['budget', 'cheap', 'affordable'])
    ? 'low'
    : includesAny(text, ['premium', 'luxury', 'best'])
      ? 'high'
      : 'mid'

  const advice = `I pulled ${style.toLowerCase()} pieces${category ? ` from the ${category.toLowerCase()} edit` : ''} that fit what you described. Mix a hero piece with a versatile base so the look works beyond a single occasion.`

  return {
    occasion: occasion || undefined,
    style,
    category,
    type,
    colors,
    budget,
    advice,
  }
}

export function matchProducts(intent: StylistIntent, excludeSlug?: string, limit = 4) {
  const catalog = getCatalog().filter((item) => item.slug !== excludeSlug)

  const scored = catalog.map((item) => {
    let score = item.rating * 8 + (item.isFeatured ? 12 : 0)
    if (intent.style && item.style === intent.style) score += 40
    if (intent.category && item.category === intent.category) score += 24
    if (intent.type && item.type === intent.type) score += 28
    if (intent.colors?.length && intent.colors.some((color) => item.colors.includes(color))) score += 16
    if (intent.budget === 'low') score += Math.max(0, 40 - item.price / 8)
    if (intent.budget === 'high') score += item.price / 10
    return { item, score }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => toCard(item))
}

function extractJson(text: string) {
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) return null
  try {
    return JSON.parse(match[0]) as Partial<StylistIntent>
  } catch {
    return null
  }
}

function normalizeIntent(raw: Partial<StylistIntent>, fallback: StylistIntent): StylistIntent {
  return {
    occasion: raw.occasion || fallback.occasion,
    style: STYLE_VALUES.includes(raw.style as (typeof STYLE_VALUES)[number]) ? raw.style : fallback.style,
    category: CATEGORY_VALUES.includes(raw.category as (typeof CATEGORY_VALUES)[number])
      ? raw.category
      : fallback.category,
    type: TYPE_VALUES.includes(raw.type as (typeof TYPE_VALUES)[number]) ? raw.type : fallback.type,
    colors: Array.isArray(raw.colors)
      ? raw.colors.filter((color): color is string => COLOR_VALUES.includes(color as (typeof COLOR_VALUES)[number]))
      : fallback.colors,
    budget: raw.budget === 'low' || raw.budget === 'mid' || raw.budget === 'high' ? raw.budget : fallback.budget,
    advice: raw.advice?.trim() || fallback.advice,
  }
}

async function completeWithHuggingFace(messages: { role: 'system' | 'user' | 'assistant'; content: string }[]) {
  const { token, model } = getHuggingFaceConfig()
  if (!token) return null

  const client = new InferenceClient(token)
  const response = await client.chatCompletion({
    model,
    messages,
    max_tokens: 500,
    temperature: 0.4,
  })

  return response.choices[0]?.message?.content || null
}

export async function runStylist(input: {
  message: string
  occasion?: string
  productSlug?: string
  history?: StylistMessage[]
}) {
  const product = input.productSlug ? getProductBySlug(input.productSlug) : null
  const fallback = inferIntent(
    `${input.message} ${product ? `${product.title} ${product.style} ${product.category} ${product.type}` : ''}`,
    input.occasion
  )

  const catalogHint = product
    ? `The shopper is looking at "${product.title}", a ${product.style.toLowerCase()} ${product.type.toLowerCase()} in ${product.category}.`
    : 'Recommend a complete outfit from the live SHOP.CO catalog.'

  const system = `You are SHOP.CO's in-house stylist. Reply with JSON only using this shape:
{"occasion":"string","style":"Casual|Formal|Party|Gym","category":"Mens|Womens|Children|Accessories","type":"Jeans|Shirts|Hoodie|Polo Shirts|Jackets","colors":["Black"|"Gray"|"White"],"budget":"low|mid|high","advice":"2 short sentences of practical styling advice"}
${catalogHint}
Keep advice specific, warm, and commercial. Never mention being an AI model.`

  let intent = fallback
  let provider = 'catalog-matching'

  try {
    const content = await completeWithHuggingFace([
      { role: 'system', content: system },
      ...(input.history || []).slice(-6),
      { role: 'user', content: input.message },
    ])

    if (content) {
      const parsed = extractJson(content)
      if (parsed) {
        intent = normalizeIntent(parsed, fallback)
        provider = getHuggingFaceConfig().model
      }
    }
  } catch (error) {
    logEvent('stylist.huggingface_fallback', {
      reason: error instanceof Error ? error.message : 'unknown',
    })
  }

  const products = matchProducts(intent, product?.slug, 4)

  return {
    advice: intent.advice,
    intent,
    products,
    provider,
    focusProduct: product ? toCard(product) : null,
  }
}

export function productToPrompt(product: Product) {
  return `${product.title}: ${product.style} ${product.type} for ${product.category}, $${product.price}`
}
