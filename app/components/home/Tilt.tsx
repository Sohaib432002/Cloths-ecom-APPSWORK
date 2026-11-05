'use client'

import { useRef } from 'react'

// Card that leans towards the mouse and catches a soft light, giving flat tiles some depth.
// Touch screens and reduced-motion users get the plain card.
export default function Tilt({
  children,
  className = '',
  max = 9,
}: {
  children: React.ReactNode
  className?: string
  max?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse') return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    el.style.setProperty('--ry', `${((x - 0.5) * 2 * max).toFixed(2)}deg`)
    el.style.setProperty('--rx', `${(-(y - 0.5) * 2 * max).toFixed(2)}deg`)
    el.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`)
    el.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`)
  }

  const reset = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  return (
    <div style={{ perspective: '900px' }} className={className}>
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        className="tilt-card relative h-full"
      >
        {children}
        <span className="tilt-glare pointer-events-none absolute inset-0 rounded-[inherit]" aria-hidden="true" />
      </div>
    </div>
  )
}
