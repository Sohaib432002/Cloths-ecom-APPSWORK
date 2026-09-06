'use client'

import Image from 'next/image'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '@/hooks/usecart'
import type { CartLine } from '@/types/product'
import { formatMoney } from '@/lib/commerce/pricing'

export const Item = ({ item }: { item: CartLine }) => {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart()

  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm transition hover:shadow-md sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row">
        <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-2xl bg-gray-100 sm:h-52 sm:w-52">
          <Image src={item.image} alt={item.title} fill className="object-cover" />
        </div>
        <div className="flex flex-1 flex-col justify-between">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{item.title}</h2>
              <div className="mt-4 flex flex-wrap gap-3">
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                  Size: {item.size || 'N/A'}
                </span>
                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                  Color: {item.color || 'N/A'}
                </span>
              </div>
            </div>
            <button
              type="button"
              aria-label={`Remove ${item.title} from cart`}
              onClick={() => removeFromCart(item.lineId)}
              className="rounded-full p-2 text-red-500 transition hover:bg-red-50"
            >
              <Trash2 size={20} />
            </button>
          </div>
          <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-500">
                {formatMoney(item.price)} × {item.quantity}
              </p>
              <h3 className="text-2xl font-bold">{formatMoney(item.price * item.quantity)}</h3>
            </div>
            <div className="flex w-fit items-center rounded-full bg-gray-100 p-2">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => decreaseQuantity(item.lineId)}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-black hover:text-white"
              >
                <Minus size={18} />
              </button>
              <span className="w-10 text-center text-lg font-semibold">{item.quantity}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => increaseQuantity(item.lineId)}
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-black hover:text-white"
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
