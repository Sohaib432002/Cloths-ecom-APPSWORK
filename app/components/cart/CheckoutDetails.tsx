'use client'

import Link from 'next/link'
import { ArrowRight, Tag, Truck, ShoppingBag } from 'lucide-react'
import { useCart } from '@/hooks/usecart'
import { cartQuantity, formatMoney, getOrderTotals } from '@/lib/commerce/pricing'
import ApplyCoupon from '../checkout/applyCopon'
import type { CartLine } from '@/types/product'

export const CheckoutDetails = ({ cart }: { cart: CartLine[] }) => {
  const { coupon } = useCart()
  const { subtotal, discount, deliveryFee, total } = getOrderTotals(cart, coupon)
  const quantity = cartQuantity(cart)

  if (cart.length === 0) {
    return (
      <div className="rounded-3xl border bg-white p-8 text-center shadow-sm">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
        <h2 className="mt-5 text-2xl font-bold">Your cart is empty</h2>
        <Link href="/Store" className="mt-6 inline-flex rounded-full bg-black px-8 py-3 text-white">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full rounded-3xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
      <h2 className="text-2xl font-bold">Order Summary</h2>
      <div className="mt-6 space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Subtotal ({quantity} items)</span>
          <span className="font-semibold">{formatMoney(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-gray-500">
          <span className="inline-flex items-center gap-2">
            <Tag size={18} />
            Discount {coupon ? `(${coupon.code})` : ''}
          </span>
          <span className="font-semibold text-red-500">-{formatMoney(discount)}</span>
        </div>
        <div className="flex items-center justify-between text-gray-500">
          <span className="inline-flex items-center gap-2">
            <Truck size={18} />
            Delivery
          </span>
          <span className="font-semibold">{deliveryFee === 0 ? 'Free' : formatMoney(deliveryFee)}</span>
        </div>
      </div>
      <div className="mt-6">
        <ApplyCoupon subtotal={subtotal} />
      </div>
      <hr className="my-7 border-gray-200" />
      <div className="flex items-center justify-between">
        <span className="text-xl font-semibold">Total</span>
        <span className="text-3xl font-bold">{formatMoney(total)}</span>
      </div>
      <Link
        href="/checkout"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-black py-4 text-lg font-semibold text-white hover:bg-gray-800"
      >
        Proceed to Checkout
        <ArrowRight size={20} />
      </Link>
    </div>
  )
}
