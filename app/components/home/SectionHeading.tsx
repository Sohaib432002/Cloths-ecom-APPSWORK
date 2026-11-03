import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type Props = {
  eyebrow: string
  title: React.ReactNode
  href?: string
  linkLabel?: string
}

export default function SectionHeading({ eyebrow, title, href, linkLabel }: Props) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <p className="eyebrow flex items-center gap-3">
          <span className="h-px w-5 bg-brand" aria-hidden="true" />
          {eyebrow}
        </p>
        <h2 className="mt-3 text-[28px] font-extrabold leading-[1.1] sm:text-4xl">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="hidden shrink-0 items-center gap-2 text-[13px] font-medium text-brand transition hover:gap-3 sm:inline-flex"
        >
          {linkLabel} <ArrowRight size={15} />
        </Link>
      )}
    </div>
  )
}
