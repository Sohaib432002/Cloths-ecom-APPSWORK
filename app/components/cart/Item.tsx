'use client'

import Image from 'next/image'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '@/hooks/usecart'

type CartItemtypes = {
  id: number
  title: string
  slug: string
  category?: string
  brand?: string
  description?: string
  sku?: string
  image: string
  gallery?: string[]
  price: number
  oldPrice?: number | null
  discount?: number
  currency?: string
  rating?: number
  reviews?: number
  stock?: number
  sizes?: string[]
  colors?: string[]
  features?: string[]
  isFeatured?: boolean
  isNew?: boolean
  selectedColor?: string
  selectedSize?: string
  quantity: number
}

type PropsItem = {
  item: CartItemtypes
}

export const Item = ({ item }: PropsItem) => {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart()

  const sizeMap: Record<string, string> = {
    S: 'Small',
    M: 'Medium',
    L: 'Large',
    XL: 'Extra Large',
  }

  const totalPrice = item.price * item.quantity

  const displaySize =
    item.selectedSize || (item.sizes?.length ? (sizeMap[item.sizes[0]] ?? item.sizes[0]) : 'N/A')

  const displayColor = item.selectedColor || (item.colors?.length ? item.colors[0] : 'N/A')

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-5 sm:flex-row">
        {/* Image */}
        <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-2xl bg-gray-100 sm:h-52 sm:w-52">
          <Image src={item.image} alt={item.title} fill className="object-cover" />
        </div>

        {/* Details */}
        <div className="flex flex-1 flex-col justify-between">
          {/* Top */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-gray-500 sm:text-sm">
                  {item.brand}
                </p>

                <h2 className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl">{item.title}</h2>
              </div>

              <button
                title="Remove Item"
                onClick={() => removeFromCart(item.id)}
                className="rounded-full p-2 text-red-500 transition hover:bg-red-50"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-3">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                Size: {displaySize}
              </span>

              <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                Color: {displayColor}
              </span>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {item.currency}
                {item.price.toFixed(2)} × {item.quantity}
              </p>

              <h3 className="text-2xl font-bold text-black sm:text-3xl">
                {item.currency}
                {totalPrice.toFixed(2)}
              </h3>
            </div>

            {/* Quantity */}
            <div className="flex w-fit items-center rounded-full bg-gray-100 p-2">
              <button
                onClick={() => {
                  if (item.quantity > 1) {
                    decreaseQuantity(item.id)
                  }
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-black hover:text-white sm:h-10 sm:w-10"
              >
                <Minus size={18} />
              </button>

              <span className="w-10 text-center text-lg font-semibold">{item.quantity}</span>

              <button
                onClick={() => increaseQuantity(item.id)}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition sm:h-10 sm:w-10 ${'cursor-pointer bg-gray-400 text-white'}`}
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Item
