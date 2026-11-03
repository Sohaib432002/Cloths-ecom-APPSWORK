'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Heart, ShoppingBag, Check } from 'lucide-react'
import { StarRating } from './StarRating'
import { useWishlist } from '@/context/wishlistContext'
import { useCart } from '@/hooks/usecart'
import { categoryLabel } from '@/lib/catalog/facets'
import type { ProductCardData } from '@/types/product'

type CardProps = ProductCardData & {
  href?: string
  category?: string
}

const ProductCard = ({
  id,
  slug,
  image,
  title,
  price,
  oldPrice,
  rating,
  reviews,
  discount,
  sizes,
  colors,
  stock,
  category,
  href,
}: CardProps) => {
  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist()
  const { addToCart, cart } = useCart()
  const wishlisted = wishlist.some((item) => item.id === id)
  const inCart = cart.some((item) => item.id === id)
  const product = { id, slug, title, price, image, rating, discount, sizes, colors, stock }
  const link = href || `/ProductDetails/${slug}`
  const soldOut = typeof stock === 'number' && stock <= 0
  const compareAt = oldPrice ?? (discount > 0 ? price / (1 - discount / 100) : null)

  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-lavender-200/70 bg-white p-2.5 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-14px_rgba(98,72,196,0.35)] sm:p-3">
      <Link href={link} className="relative block aspect-square overflow-hidden rounded-xl bg-lavender-100">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {discount > 0 && (
          <span className="absolute left-2 top-2 rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold text-white sm:text-xs">
            -{discount}%
          </span>
        )}
        {soldOut && (
          <span className="absolute inset-x-0 bottom-0 bg-black/70 py-1 text-center text-xs font-medium text-white">
            Sold out
          </span>
        )}
      </Link>

      <button
        type="button"
        aria-label={wishlisted ? `Remove ${title} from wishlist` : `Save ${title} to wishlist`}
        aria-pressed={wishlisted}
        onClick={() => (wishlisted ? removeFromWishlist(id) : addToWishlist(product))}
        className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 shadow-sm transition hover:scale-105 sm:right-5 sm:top-5"
      >
        <Heart size={15} className={wishlisted ? 'fill-brand text-brand' : 'text-gray-500'} />
      </button>

      <div className="mt-3 flex flex-1 flex-col px-1 pb-1">
        <Link href={link}>
          <h3 className="line-clamp-1 text-sm font-semibold tracking-normal sm:text-[15px]">{title}</h3>
        </Link>
        {category && <p className="mt-0.5 text-xs text-gray-400">{categoryLabel(category)}</p>}
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className={`text-sm font-bold sm:text-base ${discount > 0 ? 'text-brand' : 'text-black'}`}>
            ${price.toFixed(2)}
          </span>
          {compareAt && discount > 0 && (
            <span className="text-xs text-gray-400 line-through">${compareAt.toFixed(2)}</span>
          )}
        </div>
        <div className="mt-1.5 flex min-h-5 items-center gap-1.5">
          {reviews === 0 ? (
            <span className="text-xs text-gray-400">New arrival</span>
          ) : (
            <>
              <StarRating rating={rating} size="sm" showValue={false} />
              {typeof reviews === 'number' && <span className="text-xs text-gray-400">({reviews})</span>}
            </>
          )}
        </div>
        <button
          type="button"
          disabled={soldOut}
          onClick={() => addToCart(product)}
          className={`mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-full text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
            inCart
              ? 'bg-lavender-100 text-brand-dark hover:bg-lavender-200'
              : 'bg-brand text-white hover:bg-brand-dark'
          }`}
        >
          {inCart ? <Check size={15} /> : <ShoppingBag size={15} />}
          {inCart ? 'In your bag' : 'Add to bag'}
        </button>
      </div>
    </article>
  )
}

export default ProductCard
