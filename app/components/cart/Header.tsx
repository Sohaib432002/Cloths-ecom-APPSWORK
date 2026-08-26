import React from 'react'
import Link from 'next/link'

export const Header = () => {
  return (
    <div className="flex items-center gap-3 text-sm text-gray-500">
      <Link href="/" className="transition hover:text-black">
        Home
      </Link>

      <i className="fa-solid fa-angle-right text-xs"></i>

      <span className="font-medium text-black">Cart</span>
    </div>
  )
}
