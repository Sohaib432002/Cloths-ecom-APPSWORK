import type { Metadata } from 'next'
import { MessageCircle, Search, Shirt, ShieldCheck, Sparkles } from 'lucide-react'
import { StylistChat } from '@/app/components/stylist/StylistChat'
import { LogoMark } from '@/app/components/common/Logo'
import Tilt from '@/app/components/home/Tilt'
import { SITE } from '@/lib/site'

export const metadata: Metadata = {
  title: 'AI Stylist & Assistant',
  description: 'Ask Véora anything: outfit ideas for your occasion, product search, delivery, returns, payment and order tracking.',
}

const PROMPTS = [
  'What should I wear to a wedding?',
  'Show me sneakers under $80',
  'Tell me about this website',
  'How does delivery work?',
  'Track my order',
]

const FEATURES = [
  { Icon: Shirt, title: 'Outfit ideas', text: 'Tell it the occasion, weather or budget and get a look built from pieces in stock.' },
  { Icon: Search, title: 'Find products', text: 'Ask in plain words, like “black hoodie under $60”, in English or Roman Urdu.' },
  { Icon: ShieldCheck, title: 'Store answers', text: 'Delivery, returns, payment, offers and your order status, answered straight away.' },
]

export default function StylistPage() {
  return (
    <div className="mx-auto max-w-310 pb-6 pt-4 lg:pt-6">
      <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-lavender-100 via-lavender-50 to-white px-5 py-10 sm:px-10 lg:px-14 lg:py-14">
        <div className="pointer-events-none absolute -right-20 -top-24 h-96 w-96 rounded-full bg-brand-soft/30 blur-3xl" />
        <div className="relative grid items-start gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="min-w-0">
            <p className="eyebrow inline-flex items-center gap-2">
              <Sparkles size={14} /> Véora AI
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] sm:text-5xl">
              Your personal
              <br />
              <span className="bg-gradient-to-r from-brand to-[#b07cf0] bg-clip-text text-transparent">stylist & assistant</span>
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-7 text-gray-600">
              Ask about an outfit, a product, or anything about the store. It answers instantly and shows real pieces you can
              open and add to your cart.
            </p>

            <ul className="mt-8 space-y-4">
              {FEATURES.map(({ Icon, title, text }) => (
                <li key={title}>
                  <Tilt className="rounded-2xl" max={6}>
                    <div className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-[0_14px_30px_-18px_rgba(98,72,196,0.5)]">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-lavender-100 text-brand" style={{ transform: 'translateZ(20px)' }}>
                        <Icon size={22} strokeWidth={1.6} />
                      </span>
                      <span>
                        <span className="block font-semibold">{title}</span>
                        <span className="mt-0.5 block text-sm leading-6 text-gray-600">{text}</span>
                      </span>
                    </div>
                  </Tilt>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs text-gray-500">Want a person instead? WhatsApp or call {SITE.phoneDisplay}.</p>
          </div>

          <Tilt className="min-w-0 rounded-[28px]" max={3}>
            <section
              aria-label="Véora assistant"
              className="overflow-hidden rounded-[28px] border border-lavender-200 bg-white shadow-[0_40px_70px_-30px_rgba(98,72,196,0.55)]"
            >
              <header className="flex items-center gap-3 bg-indigo-deep px-5 py-4 text-white">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white">
                  <LogoMark className="h-6 w-6" />
                </span>
                <div className="flex-1">
                  <p className="font-semibold leading-tight">Véora Assistant</p>
                  <p className="flex items-center gap-1.5 text-xs text-white/70">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" /> Online · replies instantly
                  </p>
                </div>
                <MessageCircle size={20} className="text-white/60" />
              </header>
              <div className="h-[520px] bg-lavender-50/60 p-4 sm:h-[560px] sm:p-5">
                <StylistChat
                  compact
                  endpoint="/api/assistant"
                  prompts={PROMPTS}
                  greeting="Hi! I'm the Véora assistant. Tell me the occasion, your budget or what you're looking for, or ask about delivery, returns, payment and your order."
                  placeholder="Ask about outfits, products, delivery..."
                />
              </div>
            </section>
          </Tilt>
        </div>
      </section>
    </div>
  )
}
