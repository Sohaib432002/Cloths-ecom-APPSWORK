import Link from 'next/link'

export function LogoMark({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="veora-mark" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9b7cf0" />
          <stop offset="1" stopColor="#5b3fc0" />
        </linearGradient>
      </defs>
      <path d="M3.5 6.5h6.2l6.3 13.4 6.3-13.4h6.2L16 28.5 3.5 6.5Z" fill="url(#veora-mark)" />
      <path d="M12 6.5h3.2L16 8.6l.8-2.1H20L16 15 12 6.5Z" fill="#fff" opacity=".35" />
    </svg>
  )
}

export default function Logo({ href = '/', tone = 'dark' }: { href?: string; tone?: 'dark' | 'light' }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2" aria-label="Véora home">
      <LogoMark />
      <span className={`text-[22px] font-bold tracking-tight ${tone === 'light' ? 'text-white' : 'text-black'}`}>
        Véora
      </span>
    </Link>
  )
}
