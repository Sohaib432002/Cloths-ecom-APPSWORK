import React from 'react'
import Link from 'next/link'

export const Header = () => {
  return (
    <div className="my-6 flex items-center gap-2 text-sm md:text-base text-gray-500">
      <Link href="/" className="hover:text-black transition-colors duration-300">
        Home
      </Link>

      <i className="fa-solid fa-angle-right text-xs"></i>

      <span className="font-medium text-black">Cart</span>
    </div>
  )
}
