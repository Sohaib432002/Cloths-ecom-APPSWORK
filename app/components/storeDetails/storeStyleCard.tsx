'use client'

import Image from 'next/image'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { StarRating } from '../common/StarRating'
import { useWishlist } from '@/context/wishlistContext'
import { useCart } from '@/hooks/usecart'

type CardProps = {
  id: number
  slug: string
  image: string
  title: string
  price: number
  rating: number
  discount: number
  sizes: string[]
  colors: string[]
}

export const DressingStyleCard = ({
  id,
  slug,
  image,
  title,
  price,
  rating,
  discount,
  sizes,
  colors,
}: CardProps) => {
  const finalPrice = price - (price * discount) / 100

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { addToCart, removeFromCart, cart } = useCart()

  const isWishlisted = isInWishlist(id)
  const cartItem = cart.some((item) => item.id === id)

 const product = {
   id,
   slug,
   title,
   price,
   image,
   rating,
   discount,
   sizes,
   colors,
   oldPrice: null,
   brand: '',
   category: '',
   type: '',
   style: '',
 }
  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isWishlisted) {
      removeFromWishlist(id)
    } else {
      addToWishlist(product)
    }
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (cartItem) return

    addToCart(
      product
    )
  }

  const handleRemoveFromCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    removeFromCart(id)
  }

  return (
    <div className="group relative rounded-xl border border-gray-200 bg-white p-2 sm:p-3 transition-all duration-300 hover:shadow-lg">
      {' '}
      {/* Wishlist */}
      <button
        onClick={handleWishlist}
        className="absolute right-3 top-3 z-20 rounded-full bg-white/90 p-1.5 shadow-md backdrop-blur transition hover:scale-110"
      >
        <Heart
          size={16}
          className={`transition ${
            isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500 hover:text-red-500'
          }`}
        />
      </button>
      {/* Discount */}
      {discount > 0 && (
        <span className="absolute left-3 top-3 z-20 rounded-full bg-red-500 px-2 py-1 text-[10px] font-bold text-white sm:px-3 sm:text-xs">
          -{discount}%
        </span>
      )}
      {/* Image */}
      <div className="overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={image}
          alt={title}
          width={320}
          height={360}
          className="h-36 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-44 md:h-56"
        />
      </div>
      {/* Info */}
      <div className="mt-3">
        <h3 className="line-clamp-2 text-xs font-semibold text-gray-900 sm:text-sm md:text-lg">
          {title}
        </h3>
        <div className="mt-1 flex items-center gap-1">
          <StarRating rating={rating} />

          <span className="text-[10px] text-gray-500 sm:text-xs">({rating.toFixed(1)})</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {discount > 0 ? (
            <>
              <span className="text-sm font-bold text-black sm:text-lg md:text-2xl">
                ${finalPrice.toFixed(2)}
              </span>

              <span className="text-[11px] text-gray-400 line-through sm:text-sm md:text-lg">
                ${price.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-sm font-bold text-black sm:text-lg md:text-2xl">
              ${price.toFixed(2)}
            </span>
          )}
        </div>{' '}
        {/* Cart Button */}
        {cartItem ? (
          <button
            onClick={handleRemoveFromCart}
            className="mt-3 flex h-9 w-full items-center justify-center gap-1 rounded-lg bg-red-600 text-[11px] font-medium text-white transition hover:bg-red-700 sm:mt-4 sm:h-10 sm:gap-2 sm:text-sm md:mt-6 md:h-12 md:rounded-xl md:text-base"
          >
            <Trash2 size={14} className="sm:size-4 md:size-[18px]" />
            <span className="truncate">Remove</span>
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            className="mt-3 flex h-9 w-full items-center justify-center gap-1 rounded-lg bg-black text-[11px] font-medium text-white transition hover:bg-gray-800 sm:mt-4 sm:h-10 sm:gap-2 sm:text-sm md:mt-6 md:h-12 md:rounded-xl md:text-base"
          >
            <ShoppingCart size={14} className="sm:size-4 md:size-[18px]" />
            <span className="truncate">Add to Cart</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default DressingStyleCard
