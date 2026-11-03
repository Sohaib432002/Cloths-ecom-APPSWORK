'use client'

import { Item } from './Item'
import { CheckoutDetails } from './CheckoutDetails'
import { useCart } from '@/hooks/usecart'
import Link from 'next/link'

export const CartItems = () => {
  const { cart } = useCart()

  if (cart.length === 0) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 py-16 text-center">
        <h2 className="text-2xl font-semibold">Your cart is empty</h2>
        <p className="text-gray-500">Add a few pieces, or ask the stylist to build an outfit.</p>
        <div className="flex gap-3">
          <Link href="/Store" className="rounded-full bg-brand px-6 py-3 text-white">
            Shop catalog
          </Link>
          <Link href="/stylist" className="rounded-full border px-6 py-3">
            Ask stylist
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto w-full max-w-310 py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="order-2 space-y-4 lg:order-1 lg:col-span-2">
          {cart.map((item) => (
            <Item key={item.lineId} item={item} />
          ))}
        </div>
        <div className="order-1 lg:order-2 lg:col-span-1">
          <div className="sticky top-24">
            <CheckoutDetails cart={cart} />
          </div>
        </div>
      </div>
    </div>
  )
}
