'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { StarRating } from './StarRating'
import { useWishlist } from '@/context/wishlistContext'
import { useCart } from '@/hooks/usecart'
import type { ProductCardData } from '@/types/product'

type CardProps = ProductCardData & {
  href?: string
}

const ProductCard = ({
  id,
  slug,
  image,
  title,
  price,
  rating,
  discount,
  sizes,
  colors,
  stock,
  href,
}: CardProps) => {
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist()
  const { addToCart, cart } = useCart()
  const wishlisted = wishlist.some((item) => item.id === id)
  const inCart = cart.some((item) => item.id === id)
  const product = { id, slug, title, price, image, rating, discount, sizes, colors, stock }

  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-lg sm:p-4">
      <Link href={href || `/ProductDetails/${slug}`} className="relative block aspect-square overflow-hidden rounded-xl bg-gray-100">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        {discount > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-red-100 px-2 py-1 text-[10px] font-semibold text-red-600 sm:text-xs">
            -{discount}%
          </span>
        )}
      </Link>

      <button
        type="button"
        aria-label={wishlisted ? `Remove ${title} from wishlist` : `Save ${title} to wishlist`}
        onClick={() => (wishlisted ? removeFromWishlist(id) : addToWishlist(product))}
        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full bg-white shadow sm:right-6 sm:top-6"
      >
        <Heart size={16} className={wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'} />
      </button>

      <div className="mt-3 flex flex-1 flex-col sm:mt-4">
        <Link href={href || `/ProductDetails/${slug}`}>
          <h3 className="line-clamp-2 text-sm font-semibold sm:text-base">{title}</h3>
        </Link>
        <div className="mt-1 flex items-center gap-2">
          <StarRating rating={rating} />
          <span className="text-[10px] text-gray-500 sm:text-xs">({rating.toFixed(1)})</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm font-bold sm:text-lg">${price.toFixed(2)}</span>
          {discount > 0 && (
            <span className="text-[11px] text-gray-400 line-through sm:text-sm">
              ${(price / (1 - discount / 100)).toFixed(2)}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => addToCart(product)}
          className={`mt-auto flex h-10 w-full items-center justify-center gap-2 rounded-lg text-xs text-white transition sm:h-11 ${
            inCart ? 'bg-emerald-700 hover:bg-emerald-800' : 'bg-black hover:bg-gray-800'
          }`}
        >
          {inCart ? <Trash2 size={15} /> : <ShoppingCart size={15} />}
          {inCart ? 'Added' : 'Add to Cart'}
        </button>
      </div>
    </article>
  )
}

export default ProductCard
