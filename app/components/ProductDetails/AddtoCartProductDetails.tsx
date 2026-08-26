'use client'

import { useCart } from '@/hooks/usecart'
import { Check, ShoppingCart } from 'lucide-react'
import { useState } from 'react'

type Product = {
  id: number
  title: string
  slug: string
  category: string
  brand: string
  price: number
  oldPrice: number | null
  discount: number
  currency: string
  rating: number
  reviews: number
  stock: number
  sku: string
  image: string
  gallery: string[]
  colors: string[]
  sizes: string[]
  style: string
  description: string
  features: string[]
  isNew: boolean
  isFeatured: boolean
  selectedColor?: string
  selectedSize?: string
}

type ProductSpecifications = {
  size: string
  color: string
}

type Props = {
  product: Product
  ProductSpecifications: ProductSpecifications
}

export const ProductAddtoCartDetails = ({ product, ProductSpecifications }: Props) => {
  const { cart, addToCart, increaseQuantity } = useCart()

  const productWithSpecifications: Product = {
    ...product,
    selectedColor: ProductSpecifications.color,
    selectedSize: ProductSpecifications.size,
  }
  const cartItem = cart.find((item) => item.id === product.id)

  const [quantityofproducts, setQuantityOfProducts] = useState(1)

  const handleIncrease = () => {
    setQuantityOfProducts((prev) => prev + 1)
  }

  const handleDecrease = () => {
    if (quantityofproducts > 1) {
      setQuantityOfProducts((prev) => prev - 1)
    }
  }

  const handleAddToCart = () => {
    if (cartItem) return

    addToCart(productWithSpecifications)

    for (let i = 1; i < quantityofproducts; i++) {
      increaseQuantity(productWithSpecifications.id)
    }
  }

  return (
    <div
      className="
        flex
        w-full
        flex-col
        gap-3
        sm:flex-row
        sm:items-center
      "
    >
      {/* Quantity */}

      <div
        className="
          flex
          h-10
          w-full
          items-center
          justify-between
          rounded-full
          bg-gray-100
          px-5
          sm:h-12
          sm:w-40
        "
      >
        <button
          onClick={handleDecrease}
          className="
            cursor-pointer
            text-xl
            font-medium
            hover:text-gray-600
            sm:text-3xl
          "
        >
          -
        </button>

        <span
          className="
            text-base
            font-semibold
            sm:text-lg
          "
        >
          {quantityofproducts}
        </span>

        <button
          onClick={handleIncrease}
          className="
            cursor-pointer
            text-xl
            font-medium
            hover:text-gray-600
            sm:text-3xl
          "
        >
          +
        </button>
      </div>

      {/* Add To Cart Button */}

      <div className="w-full sm:flex-1">
        <button
          onClick={handleAddToCart}
          disabled={!!cartItem}
          className={`
            flex
            h-10
            w-full
            items-center
            justify-center
            gap-2
            rounded-full
            text-sm
            font-semibold
            transition

            sm:h-12
            sm:text-base

            ${
              cartItem
                ? 'cursor-not-allowed bg-green-600 text-white'
                : 'bg-black text-white hover:bg-gray-800'
            }
          `}
        >
          {cartItem ? <Check size={16} /> : <ShoppingCart size={16} />}

          {cartItem ? 'Added to Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
