'use client'

import { Package, Truck, Tag } from 'lucide-react'
import { CheckoutButton } from './CheckoutButton'
import { useCart } from '@/hooks/usecart'
import ApplyCoupon from './applyCopon'
import { formatMoney, getOrderTotals } from '@/lib/commerce/pricing'
import type { PaymentMethodId } from '@/types/product'

type FormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  zipCode: string
}

export const OrderSummary = ({
  formData,
  setErrors,
  paymentMethod,
}: {
  formData: FormData
  errors: Record<string, string>
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
  paymentMethod: PaymentMethodId
}) => {
  const { cart, coupon } = useCart()
  const { subtotal, discount, deliveryFee, total } = getOrderTotals(cart, coupon)

  return (
    <div className="sticky top-24 rounded-3xl border border-gray-200 bg-white p-4 shadow-lg sm:p-8">
      <h2 className="mb-5 text-2xl font-bold">Order Summary</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between text-gray-600">
          <span className="inline-flex items-center gap-2">
            <Package size={18} /> Subtotal
          </span>
          <span className="font-semibold text-black">{formatMoney(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-gray-600">
          <span className="inline-flex items-center gap-2">
            <Tag size={18} /> Discount
          </span>
          <span className="font-semibold text-green-600">-{formatMoney(discount)}</span>
        </div>
        <div className="flex items-center justify-between text-gray-600">
          <span className="inline-flex items-center gap-2">
            <Truck size={18} /> Delivery
          </span>
          <span className="font-semibold text-black">
            {deliveryFee === 0 ? 'Free' : formatMoney(deliveryFee)}
          </span>
        </div>
      </div>
      <div className="mt-6 rounded-2xl bg-lavender-50 p-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold">Total</span>
          <span className="text-2xl font-bold">{formatMoney(total)}</span>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-3">
        <CheckoutButton formData={formData} setErrors={setErrors} paymentMethod={paymentMethod} />
        <ApplyCoupon subtotal={subtotal} />
      </div>
    </div>
  )
}

export default OrderSummary
