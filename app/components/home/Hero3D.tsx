'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'

type Mini = { slug: string; title: string; image: string; price: number }

// A small 3D stage: the model sits in the middle, everything else floats at a different depth, and the whole
// scene turns slowly towards the mouse so the depth is easy to see.
export default function Hero3D({ heroImage, best, floating, cube }: { heroImage: string; best?: Mini; floating?: Mini; cube: string[] }) {
  const stage = useRef<HTMLDivElement>(null)
  const scene = useRef<HTMLDivElement>(null)
  const frame = useRef(0)

  const onMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || !stage.current) return
    const rect = stage.current.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      if (scene.current) scene.current.style.transform = `rotateY(${(x * 22).toFixed(2)}deg) rotateX(${(-y * 16).toFixed(2)}deg)`
    })
  }

  const reset = () => {
    cancelAnimationFrame(frame.current)
    if (scene.current) scene.current.style.transform = 'rotateY(0deg) rotateX(0deg)'
  }

  const faces = [0, 1, 2, 3].map((i) => cube[i % Math.max(cube.length, 1)]).filter(Boolean)

  return (
    <div
      ref={stage}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className="relative mx-auto h-[430px] w-full max-w-md sm:h-[500px] lg:h-[560px] lg:max-w-none"
      style={{ perspective: '1300px' }}
    >
      <div ref={scene} className="hero-scene absolute inset-0">
        {/* back: glow + orbiting rings */}
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'translateZ(-90px)' }} aria-hidden="true">
          <div className="h-[78%] w-[78%] max-w-[420px] rounded-full bg-gradient-to-br from-brand/40 via-brand-soft/30 to-transparent blur-sm" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'translateZ(-30px)' }} aria-hidden="true">
          <div className="orbit-ring h-[92%] max-h-[470px] w-[92%] max-w-[470px] rounded-full border border-dashed border-brand/40" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center" style={{ transform: 'translateZ(-10px)' }} aria-hidden="true">
          <div className="orbit-ring-rev h-[70%] max-h-[360px] w-[70%] max-w-[360px] rounded-full border border-brand/30" />
        </div>

        {/* middle: the model */}
        <div className="absolute inset-0 flex items-end justify-center pb-4 sm:pb-6" style={{ transform: 'translateZ(10px)' }}>
          <div className="relative h-[360px] w-[250px] overflow-hidden rounded-t-[130px] rounded-b-[28px] bg-lavender-200 shadow-[0_40px_60px_-24px_rgba(60,36,150,0.55)] sm:h-[430px] sm:w-[300px] sm:rounded-t-[150px] lg:h-[480px] lg:w-[330px] lg:rounded-t-[165px]">
            <Image
              src={heroImage}
              alt="Model wearing the Véora autumn edit"
              fill
              priority
              sizes="(max-width: 640px) 250px, 330px"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30" />
          </div>
        </div>

        {/* front: floating pieces */}
        <div className="absolute left-0 top-6 sm:left-2 sm:top-10" style={{ transform: 'translateZ(110px)' }} aria-hidden="true">
          <div className="float-a">
            <div className="cube-wrap">
              <div className="cube">
                {faces.map((src, i) => (
                  <div key={i} className="cube-face" style={{ transform: `rotateY(${i * 90}deg) translateZ(var(--cube-half))` }}>
                    <Image src={src} alt="" fill sizes="90px" className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {best && (
          <div className="absolute bottom-8 left-0 sm:left-0 lg:-left-4" style={{ transform: 'translateZ(95px)' }}>
            <div className="float-b">
              <Link
                href={`/ProductDetails/${best.slug}`}
                className="flex items-center gap-3 rounded-2xl bg-white/95 p-2 pr-4 shadow-[0_24px_40px_-14px_rgba(98,72,196,0.55)] backdrop-blur"
              >
                <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-lavender-100">
                  <Image src={best.image} alt="" fill sizes="56px" className="object-cover" />
                </span>
                <span className="max-w-[120px] text-xs leading-4">
                  <span className="block font-semibold">Best seller</span>
                  <span className="line-clamp-1 text-gray-500">{best.title}</span>
                  <span className="font-semibold text-brand">${best.price.toFixed(2)}</span>
                </span>
              </Link>
            </div>
          </div>
        )}

        {floating && (
          <div className="absolute right-0 top-[38%] sm:right-1" style={{ transform: 'translateZ(75px)' }}>
            <div className="float-c">
              <Link
                href={`/ProductDetails/${floating.slug}`}
                className="block w-[92px] overflow-hidden rounded-2xl bg-white p-1.5 shadow-[0_24px_40px_-14px_rgba(98,72,196,0.55)] sm:w-[112px]"
              >
                <span className="relative block aspect-[3/4] overflow-hidden rounded-xl bg-lavender-100">
                  <Image src={floating.image} alt={floating.title} fill sizes="112px" className="object-cover" />
                </span>
                <span className="mt-1.5 block px-1 pb-0.5 text-[11px] font-semibold text-brand">${floating.price.toFixed(2)}</span>
              </Link>
            </div>
          </div>
        )}

        <p
          className="hand-note absolute right-2 top-1 hidden rotate-[-8deg] text-[28px] leading-7 text-brand sm:block"
          style={{ transform: 'translateZ(130px) rotate(-8deg)' }}
          aria-hidden="true"
        >
          Trendy Looks
          <br />
          Better You
          <span className="ml-1 text-lg">♡</span>
        </p>

        {[
          ['14%', '58%', 0, 14],
          ['82%', '78%', 1.2, 10],
          ['70%', '12%', 0.6, 12],
          ['8%', '36%', 1.8, 8],
        ].map(([left, top, delay, size], i) => (
          <span
            key={i}
            className="twinkle absolute rounded-full bg-gradient-to-br from-white to-brand-soft shadow-[0_6px_14px_rgba(124,92,220,0.5)]"
            style={{ left: left as string, top: top as string, width: size as number, height: size as number, animationDelay: `${delay}s`, transform: 'translateZ(150px)' }}
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  )
}
