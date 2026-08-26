'use client'

import Link from 'next/link'

type HeaderProps = {
  DressingStyle?: string
}

export const Header = ({ DressingStyle }: HeaderProps) => {
  return (
    <section className=" border-gray-200 bg-white">
      <div className="mx-auto max-w-310  ">
        <nav className="flex flex-wrap items-center gap-2 py-4 text-xs text-gray-500 sm:text-sm">
          <Link href="/" className="transition hover:text-black">
            Home
          </Link>

          <i className="fa-solid fa-angle-right text-[10px] text-gray-400"></i>

          <Link href="/Store" className="transition hover:text-black">
            Store
          </Link>

          {DressingStyle && (
            <>
              <i className="fa-solid fa-angle-right text-[10px] text-gray-400"></i>

              <span className="font-medium text-black">{DressingStyle}</span>
            </>
          )}
        </nav>
      </div>
    </section>
  )
}

export default Header
