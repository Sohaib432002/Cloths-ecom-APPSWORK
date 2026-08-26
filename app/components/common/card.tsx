'use client'

import Image from 'next/image'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { StarRating } from './StarRating'
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


const Card = ({ id, slug, image, title, price, rating, discount, sizes, colors }: CardProps) => {
  const finalPrice = price - (price * discount) / 100

  const { addToWishlist, removeFromWishlist, wishlist } = useWishlist()

  const { addToCart, removeFromCart, cart } = useCart()

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
  }

  const wishlisted = wishlist.some((item) => item.id === id)

  const cartItem = cart.some((item) => item.id === id)

  const handleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (wishlisted) {
      removeFromWishlist(id)
    } else {
      addToWishlist(product)
    }
  }

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    if (cartItem) return

    addToCart(product)
  }

  const handleRemoveFromCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()

    removeFromCart(id)
  }

  return (
    <div
      className="
      group
      rounded-2xl
      border
      border-gray-200
      bg-white
      p-3
      sm:p-4
      transition
      hover:shadow-lg
      "
    >
      {/* Image */}

      <div
        className="
        relative
        aspect-square
        overflow-hidden
        rounded-xl
        bg-gray-100
        "
      >
        <Image
          src={image}
          alt={title}
          fill
          className="
          object-cover
          transition
          duration-300
          group-hover:scale-105
          "
        />

        {/* Wishlist */}

        <button
          onClick={handleWishlist}
          className="
          absolute
          right-2
          top-2
          flex
          h-8
          w-8
          items-center
          justify-center
          rounded-full
          bg-white
          shadow
          sm:h-10
          sm:w-10
          "
        >
          <Heart
            size={16}
            className={`
            transition
            sm:w-5
            sm:h-5
            ${wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500 hover:text-red-500'}
            `}
          />
        </button>

        {/* Discount */}

        {discount > 0 && (
          <span
            className="
            absolute
            left-2
            top-2
            rounded-full
            bg-red-100
            px-2
            py-1
            text-[10px]
            font-medium
            text-red-500
            sm:text-xs
            "
          >
            -{discount}%
          </span>
        )}
      </div>

      {/* Product Info */}

      <div className="mt-3 sm:mt-4">
        <h3
          className="
          truncate
          text-sm
          font-semibold
          sm:text-base
          md:text-lg
          "
        >
          {title}
        </h3>

        <div
          className="
          mt-1
          flex
          items-center
          gap-2
          "
        >
          <StarRating rating={rating} />

          <span
            className="
            text-[10px]
            text-gray-500
            sm:text-xs
            "
          >
            ({rating.toFixed(1)})
          </span>
        </div>

        {/* Price */}

        <div
          className="
          mt-2
          flex
          flex-wrap
          items-center
          gap-2
          "
        >
          {discount > 0 ? (
            <>
              <span
                className="
                  text-sm
                  font-bold
                  sm:text-lg
                  md:text-2xl
                  "
              >
                ${finalPrice.toFixed(2)}
              </span>

              <span
                className="
                  text-[11px]
                  text-gray-400
                  line-through
                  sm:text-sm
                  "
              >
                ${price.toFixed(2)}
              </span>
            </>
          ) : (
            <span
              className="
                text-sm
                font-bold
                sm:text-lg
                md:text-2xl
                "
            >
              ${price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Cart */}

        {cartItem ? (
          <button
            onClick={handleRemoveFromCart}
            className="
              mt-3
              flex
              h-9
              w-full
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-red-600
              text-xs
              text-white
              hover:bg-red-700
              sm:h-10
              md:h-12
              "
          >
            <Trash2 size={15} />
            Remove
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            className="
              mt-3
              flex
              h-9
              w-full
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-black
              text-xs
              text-white
              hover:bg-gray-800
              sm:h-10
              md:h-12
              "
          >
            <ShoppingCart size={15} />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  )
}

export default Card
