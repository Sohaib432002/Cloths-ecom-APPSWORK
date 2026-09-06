'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useWishlist } from '@/context/wishlistContext'
import ProductCard from '../common/ProductCard'

export const WishlistPage = () => {
  const { wishlist } = useWishlist()

  if (wishlist.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="flex flex-col items-center justify-center rounded-3xl border bg-white py-24 text-center">
          <Heart className="mb-6 h-20 w-20 fill-red-500 text-red-500" />
          <h1 className="text-3xl font-bold">Your wishlist is empty</h1>
          <Link href="/Store" className="mt-6 rounded-full bg-black px-8 py-3 text-white">
            Browse the catalog
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-black">Wishlist</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wishlist.map((item) => (
          <ProductCard key={item.id} {...item} />
        ))}
      </div>
    </section>
  )
}
