'use client'

import { useWishlist } from '@/context/wishlistContext'

type SpecificProductProps = {
  finalPrice: number
  title: string
  rating: number
  discount: number
  price: number
  description: string
  slug: string
  id: number
  image: string
  sizes: string[]
  colors: string[]
  stock: number
}

export const SpecificProductDetails = ({
  title,
  rating,
  discount,
  price,
  finalPrice,
  description,
  slug,
  id,
  image,
  sizes,
  colors,
  stock,
}: SpecificProductProps) => {
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist()
  const product = { id, slug, title, price, image, rating, discount, sizes, colors, stock }
  const isWishlisted = isInWishlist(id)

  const handleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <div className="w-full">
      <h1
        className="
        text-2xl
        font-bold
        sm:text-3xl
        lg:text-4xl
        "
      >
        {title}
      </h1>

      <div
        className="
        mt-3
        flex
        items-center
        gap-1
        "
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const full = rating >= star

          const half = rating >= star - 0.5 && rating < star

          return (
            <span key={star} className="text-2xl sm:text-3xl">
              {full ? (
                <span className="text-yellow-400">★</span>
              ) : half ? (
                <span className="relative inline-block">
                  <span className="text-gray-300">★</span>

                  <span
                    className="
                    absolute
                    left-0
                    top-0
                    overflow-hidden
                    text-yellow-400
                    "
                    style={{
                      width: '50%',
                    }}
                  >
                    ★
                  </span>
                </span>
              ) : (
                <span className="text-gray-300">★</span>
              )}
            </span>
          )
        })}

        <span className="ml-2 text-sm text-gray-600">{rating}/5</span>
      </div>

      <div
        className="
        mt-4
        flex
        items-center
        justify-between
        "
      >
        {discount > 0 ? (
          <div className="flex items-center gap-2 flex-wrap">
            <h2
              className="
              text-xl
              font-bold
              sm:text-2xl
              lg:text-3xl
              "
            >
              ${finalPrice}
            </h2>

            <span
              className="
              text-gray-400
              line-through
              "
            >
              ${price}
            </span>

            <span
              className="
              bg-red-100
              text-red-500
              rounded-full
              px-2
              py-1
              text-xs
              "
            >
              -{discount}%
            </span>
          </div>
        ) : (
          <h2 className="text-xl font-bold">${price}</h2>
        )}

        <button
          onClick={handleWishlist}
          className="
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          hover:bg-lavender-100
          "
        >
          <i
            className={`
            fa-heart
            text-xl

            ${isWishlisted ? 'fa-solid text-red-500' : 'fa-regular text-gray-600'}

            `}
          />
        </button>
      </div>

      <p
        className="
        mt-4
        text-sm
        leading-6
        text-gray-500
        sm:text-base
        "
      >
        {description}
      </p>
    </div>
  )
}
