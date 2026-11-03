'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, X } from 'lucide-react'

type Slide = { slug: string; title: string; image: string; price: number }

const SLIDE_MS = 3200

// "Watch Collection": a short auto-playing lookbook of the newest pieces.
export default function CollectionPreview({ slides }: { slides: Slide[] }) {
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open || slides.length < 2) return
    const timer = setInterval(() => setIndex((current) => (current + 1) % slides.length), SLIDE_MS)
    return () => clearInterval(timer)
  }, [open, slides.length])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, close])

  if (!slides.length) return null
  const slide = slides[index]

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIndex(0)
          setOpen(true)
        }}
        className="group inline-flex items-center gap-3 text-[13px] font-medium"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-[0_6px_20px_-6px_rgba(98,72,196,0.45)] transition group-hover:scale-105">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white">
            <Play size={13} className="ml-0.5 fill-white" />
          </span>
        </span>
        Watch Collection
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="New collection preview"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-indigo-deeper/80 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute inset-x-4 top-3 z-10 flex gap-1.5">
              {slides.map((item, i) => (
                <span key={item.slug} className="h-1 flex-1 overflow-hidden rounded-full bg-white/50">
                  <span
                    className={`block h-full rounded-full bg-brand ${i < index ? 'w-full' : i === index ? 'collection-progress' : 'w-0'}`}
                    style={i === index ? { animationDuration: `${SLIDE_MS}ms` } : undefined}
                  />
                </span>
              ))}
            </div>
            <button
              type="button"
              aria-label="Close preview"
              onClick={close}
              className="absolute right-3 top-7 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black shadow"
            >
              <X size={18} />
            </button>
            <div className="relative aspect-[4/5] bg-lavender-100">
              <Image key={slide.slug} src={slide.image} alt={slide.title} fill sizes="400px" className="object-cover" />
            </div>
            <div className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="eyebrow">New in</p>
                <p className="truncate font-semibold">{slide.title}</p>
                <p className="text-sm text-gray-500">${slide.price.toFixed(2)}</p>
              </div>
              <Link
                href={`/ProductDetails/${slide.slug}`}
                onClick={close}
                className="shrink-0 rounded-full bg-brand px-5 py-2.5 text-[13px] font-semibold text-white hover:bg-brand-dark"
              >
                View
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
