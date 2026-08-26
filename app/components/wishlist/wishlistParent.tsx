'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { useWishlist } from '@/context/wishlistContext'

import { useProducts } from '@/context/ProductsContext'
import { useRouter } from 'next/navigation'
import { DressingStyleCard } from '../storeDetails'
type WishlistItem = {
  id: number
  title: string
  brand: string
  price: number
  oldPrice?: number
  rating: number
  reviews: number
  image: string
  color: string
  size: string
  stock: boolean
}

export const WishlistPage = () => {
  const {  wishlist } = useWishlist()
  const { products } = useProducts()
  const router = useRouter()
  const filterProduct = products.filter((product) =>
    wishlist.some((wish) => wish.id === product.id)
  )
  const isEmpty = filterProduct.length === 0
  if (isEmpty) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col items-center justify-center rounded-3xl border border-gray-200 bg-white py-24 text-center shadow-sm">
          <Heart className="h-20 w-20 text-red-500 fill-red-500 mb-6" />

          <h1 className="text-3xl font-bold text-gray-900">Your Wishlist is Empty</h1>

          <p className="mt-4 max-w-md text-gray-500">
            Looks like you haven&apos;t added any products to your wishlist yet. Start exploring and
            save your favorite items.
          </p>

          <Link
            href="/Store"
            className="mt-8 rounded-full bg-black px-8 py-3 font-semibold text-white transition hover:bg-gray-800"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Heading */}

      <div className="mb-10 flex flex-col gap-2">
        <h1 className="text-4xl font-bold text-gray-900">My Wishlist</h1>

        <p className="text-gray-500">
          Save your favorite products and purchase them whenever you&apos;re ready.
        </p>
      </div>

      {/* Wishlist */}

      <div className="space-y-6">
        <div className="grid  md:grid-cols-3  sm:grid-cols-2 grid-cols-1  sm:gap-8 lg:grid-cols-3 gap-0 ">
          {filterProduct.map((item) => {
            

            return (
              <>
                <div
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    router.push(`/ProductDetails/${item.slug}`)
                  }}
                  className="cursor-pointer"
                >
                  <DressingStyleCard
                    id={item.id}
                    title={item.title}
                    image={item.image}
                    price={item.price}
                    discount={item.discount}
                    rating={item.rating}
                    sizes={item.sizes}
                    slug={item.slug}
                    colors={item.colors}
                  />
                </div>
              </>
            )
          })}
        </div>
      </div>

      {/* Continue Shopping */}

      <div className="mt-12 flex justify-center">
        <Link
          href="/Store"
          className="rounded-full border border-gray-300 px-8 py-3 font-semibold transition hover:bg-gray-100"
        >
          Continue Shopping
        </Link>
      </div>
    </section>
  )
}
