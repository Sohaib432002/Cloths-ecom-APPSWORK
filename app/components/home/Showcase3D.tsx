'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useRef } from 'react'

type Item = { slug: string; title: string; image: string; price: number }

// A ring of products you can drag, spin with the arrows, or just watch turn.
export default function Showcase3D({ items }: { items: Item[] }) {
  const ring = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const angle = useRef(0)
  const target = useRef<number | null>(null)
  const dragging = useRef(false)
  const moved = useRef(0)
  const hovered = useRef(false)
  const visible = useRef(false)
  const count = items.length
  const step = count ? 360 / count : 360

  useEffect(() => {
    const el = ring.current
    const holder = stage.current
    if (!el || !holder || !count) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const paint = () => {
      el.style.transform = `translateZ(calc(var(--w) * -1.3)) rotateY(${angle.current.toFixed(2)}deg)`
    }
    paint()

    const io = new IntersectionObserver(([entry]) => (visible.current = entry.isIntersecting), { threshold: 0.1 })
    io.observe(holder)

    let raf = 0
    const tick = () => {
      if (visible.current) {
        if (target.current !== null) {
          const diff = target.current - angle.current
          if (Math.abs(diff) < 0.15) {
            angle.current = target.current
            target.current = null
          } else angle.current += diff * 0.12
          paint()
        } else if (!dragging.current && !hovered.current && !reduced) {
          angle.current -= 0.14
          paint()
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    let lastX = 0
    const onDown = (event: PointerEvent) => {
      dragging.current = true
      moved.current = 0
      target.current = null
      lastX = event.clientX
    }
    const onMove = (event: PointerEvent) => {
      if (!dragging.current) return
      const dx = event.clientX - lastX
      lastX = event.clientX
      moved.current += Math.abs(dx)
      angle.current += dx * 0.32
      paint()
    }
    const onUp = () => {
      if (!dragging.current) return
      dragging.current = false
      target.current = Math.round(angle.current / step) * step
    }
    holder.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      holder.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [count, step])

  const turn = (direction: 1 | -1) => {
    const base = target.current ?? Math.round(angle.current / step) * step
    target.current = base + direction * step
  }

  if (!count) return null

  return (
    <div>
      <div
        ref={stage}
        onMouseEnter={() => (hovered.current = true)}
        onMouseLeave={() => (hovered.current = false)}
        onClickCapture={(event) => {
          // a drag should not open the product underneath the pointer
          if (moved.current > 6) {
            event.preventDefault()
            event.stopPropagation()
          }
        }}
        className="showcase-stage relative mx-auto h-[360px] w-full cursor-grab select-none active:cursor-grabbing sm:h-[420px]"
        style={{ perspective: '1400px', touchAction: 'pan-y' }}
      >
        <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
          <div ref={ring} className="relative" style={{ transformStyle: 'preserve-3d', width: 'var(--w)', height: 'calc(var(--w) * 1.35)' }}>
            {items.map((item, index) => (
              <Link
                key={item.slug}
                href={`/ProductDetails/${item.slug}`}
                draggable={false}
                className="showcase-card absolute inset-0 block overflow-hidden rounded-2xl bg-white p-2 shadow-[0_30px_50px_-20px_rgba(0,0,0,0.6)]"
                style={{ transform: `rotateY(${index * step}deg) translateZ(calc(var(--w) * 1.3))` }}
              >
                <span className="relative block h-[82%] overflow-hidden rounded-xl bg-lavender-100">
                  <Image src={item.image} alt={item.title} fill sizes="220px" draggable={false} className="object-cover" />
                </span>
                <span className="mt-2 flex items-center justify-between gap-2 px-1 text-[12px]">
                  <span className="line-clamp-1 font-semibold text-black">{item.title}</span>
                  <span className="font-bold text-brand">${item.price.toFixed(2)}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-[12%] bottom-2 h-10 rounded-[50%] bg-black/40 blur-2xl" aria-hidden="true" />
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-white/60">
        <button
          type="button"
          onClick={() => turn(1)}
          aria-label="Previous look"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition hover:bg-white/10"
        >
          <ChevronLeft size={20} />
        </button>
        <span>Drag to spin</span>
        <button
          type="button"
          onClick={() => turn(-1)}
          aria-label="Next look"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white transition hover:bg-white/10"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}
