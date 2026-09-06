'use client'

import { useCart } from '@/hooks/usecart'
import { Check, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { makeLineId } from '@/context/CartContext'
import type { Product } from '@/types/product'

type ProductSpecifications = {
  size: string
  color: string
}

type Props = {
  product: Product
  ProductSpecifications: ProductSpecifications
}

export const ProductAddtoCartDetails = ({ product, ProductSpecifications }: Props) => {
  const { cart, addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)
  const lineId = makeLineId(product.id, ProductSpecifications.size, ProductSpecifications.color)
  const cartItem = cart.find((item) => item.lineId === lineId)

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      image: product.image,
      rating: product.rating,
      discount: product.discount,
      sizes: product.sizes,
      colors: product.colors,
      stock: product.stock,
      size: ProductSpecifications.size,
      color: ProductSpecifications.color,
      quantity,
    })
  }

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex h-12 w-full items-center justify-between rounded-full bg-gray-100 px-5 sm:w-40">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
          className="text-xl font-medium"
        >
          -
        </button>
        <span className="text-lg font-semibold">{quantity}</span>
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => setQuantity((prev) => Math.min(product.stock, prev + 1))}
          className="text-xl font-medium"
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={handleAddToCart}
        className={`flex h-12 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold text-white sm:flex-1 ${
          cartItem ? 'bg-emerald-700' : 'bg-black hover:bg-gray-800'
        }`}
      >
        {cartItem ? <Check size={16} /> : <ShoppingCart size={16} />}
        {cartItem ? `In cart (${cartItem.quantity})` : 'Add to Cart'}
      </button>
    </div>
  )
}
