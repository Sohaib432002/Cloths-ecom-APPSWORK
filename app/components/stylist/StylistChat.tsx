'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, Send, X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { apiFetch } from '@/lib/client/api'
import type { ProductCardData } from '@/types/product'

type ChatItem = {
  role: 'user' | 'assistant'
  content: string
  products?: ProductCardData[]
}

type StylistResponse = {
  advice: string
  products: ProductCardData[]
  provider: string
}

const PROMPTS = [
  'Office-ready look under $250',
  'Weekend casual in black and white',
  'What should I wear to a rooftop party?',
]

export function StylistChat({
  compact = false,
  productSlug,
  initialPrompt,
  endpoint = '/api/stylist',
  prompts = PROMPTS,
  greeting = 'Tell me the occasion, weather, or vibe. I will build an outfit from live Véora pieces.',
  placeholder = 'Black tie dinner, rainy commute, gym-to-brunch...',
}: {
  compact?: boolean
  productSlug?: string
  initialPrompt?: string
  endpoint?: string
  prompts?: string[]
  greeting?: string
  placeholder?: string
}) {
  const [input, setInput] = useState(initialPrompt || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [messages, setMessages] = useState<ChatItem[]>([
    {
      role: 'assistant',
      content: greeting,
    },
  ])
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text = input) => {
    const message = text.trim()
    if (!message || loading) return
    setInput('')
    setError('')
    setMessages((prev) => [...prev, { role: 'user', content: message }])
    setLoading(true)

    try {
      const history = [...messages, { role: 'user' as const, content: message }].map((item) => ({
        role: item.role,
        content: item.content,
      }))
      const data = await apiFetch<StylistResponse>(endpoint, {
        method: 'POST',
        body: JSON.stringify({ message, productSlug, history }),
      })
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.advice, products: data.products },
      ])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The stylist is unavailable right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={compact ? 'flex h-full flex-col' : 'mx-auto w-full max-w-3xl'}>
      <div className={`${compact ? 'flex-1 overflow-y-auto pr-1' : ''} space-y-4`}>
        {messages.map((item, index) => (
          <div key={`${item.role}-${index}`} className={item.role === 'user' ? 'text-right' : ''}>
            <div
              className={`inline-block max-w-[90%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                item.role === 'user' ? 'bg-brand text-white' : 'bg-lavender-100 text-gray-800'
              }`}
            >
              {item.content}
            </div>
            {item.products && item.products.length > 0 && (
              <div className="mt-3 grid grid-cols-2 gap-3 text-left">
                {item.products.map((product) => (
                  <Link
                    key={product.id}
                    href={`/ProductDetails/${product.slug}`}
                    className="overflow-hidden rounded-2xl border bg-white hover:shadow-md"
                  >
                    <div className="relative aspect-square bg-lavender-100">
                      <Image src={product.image} alt={product.title} fill className="object-cover" />
                    </div>
                    <div className="p-3">
                      <p className="line-clamp-2 text-sm font-semibold">{product.title}</p>
                      <p className="mt-1 text-sm font-bold">${product.price.toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && <p className="text-sm text-gray-500">Typing...</p>}
        {error && (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        )}
        <div ref={endRef} />
      </div>

      <div className={`mt-4 flex gap-2 ${compact ? "overflow-x-auto pb-1 scrollbar-hide" : "flex-wrap"}`}>
        {prompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => send(prompt)}
            className="shrink-0 rounded-full border border-lavender-200 px-3 py-1.5 text-xs hover:bg-lavender-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          void send()
        }}
        className="mt-4 flex items-center gap-2 rounded-full border border-lavender-200 bg-white px-3 py-2"
      >
        <Sparkles size={16} className="text-gray-500" />
        <label htmlFor="stylist-input" className="sr-only">
          Ask the stylist
        </label>
        <input
          id="stylist-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none"
        />
        <button
          type="submit"
          aria-label="Send message"
          disabled={loading}
          className="rounded-full bg-brand p-2 text-white disabled:opacity-50"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  )
}

export function StylistLauncher() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  if (pathname === '/stylist') return null

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-3 text-sm font-semibold text-white shadow-xl hover:bg-brand-dark"
      >
        <Sparkles size={16} />
        Ask Stylist
      </button>
      {open && (
        <div className="fixed inset-0 z-50 bg-brand/40" onClick={() => setOpen(false)}>
          <div
            className="absolute bottom-0 right-0 flex h-[min(720px,90vh)] w-full max-w-md flex-col rounded-t-3xl bg-white p-5 shadow-2xl sm:bottom-6 sm:right-6 sm:rounded-3xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-lg font-bold">Personal Stylist</p>
                <p className="text-xs text-gray-500">Powered by Llama 3.1 on Hugging Face</p>
              </div>
              <button type="button" aria-label="Close stylist" onClick={() => setOpen(false)}>
                <X />
              </button>
            </div>
            <StylistChat compact />
          </div>
        </div>
      )}
    </>
  )
}
