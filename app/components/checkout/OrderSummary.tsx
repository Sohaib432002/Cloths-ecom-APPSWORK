'use client'

import { Package, Truck, Tag } from 'lucide-react'
import { CheckoutButton } from './CheckoutButton'
import { useCart } from '@/hooks/usecart'
import ApplyCoupon from './applyCopon'

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

type OrderSummaryProps = {
  formData: FormData

  errors: Record<string, string>

  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>
}

export const OrderSummary = ({ formData, errors, setErrors }: OrderSummaryProps) => {
  const {cart}=useCart()
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  const discountPercentage = 20

  const discount = (subtotal * discountPercentage) / 100

  const deliveryFee = cart.length > 0 ? 15 : 0

  const total = subtotal - discount + deliveryFee

  const formatPrice = (price: number) => {
    return `$${price}`
  }

  return (
    <div
      className="
      sticky
      top-24
      rounded-3xl
      border
      border-gray-200
      bg-white
      p-4
      sm:p-6
      lg:p-8
      shadow-lg
      "
    >
      <h2
        className="
        mb-5
        sm:mb-8
        text-xl
        sm:text-2xl
        lg:text-3xl
        font-bold
        text-gray-900
        "
      >
        Order Summary
      </h2>

      <div className="my-5 sm:my-8 border-t" />

      {/* Price Details */}

      <div className="space-y-4 sm:space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
            <Package size={18} />

            <span>Subtotal</span>
          </div>

          <span className="font-semibold text-sm sm:text-base">${subtotal.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
            <Tag size={18} />

            <span>Discount</span>
          </div>

          <span className="font-semibold text-green-600 text-sm sm:text-base">
            -${discount.toFixed(2)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
            <Truck size={18} />

            <span>Delivery</span>
          </div>

          <span className="font-semibold text-sm sm:text-base">${deliveryFee.toFixed(2)}</span>
        </div>
      </div>

      {/* Total */}

      <div
        className="
        mt-6
        sm:mt-8
        rounded-2xl
        bg-gray-50
        p-4
        sm:p-5
        "
      >
        <div className="flex items-center justify-between">
          <span
            className="
            text-lg
            sm:text-xl
            font-bold
            "
          >
            Total
          </span>

          <span
            className="
            text-xl
            sm:text-2xl
            lg:text-3xl
            font-bold
            "
          >
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Checkout Button */}

      <div className="mt-6 flex flex-col gap-3 sm:mt-8">
        <CheckoutButton formData={formData} setErrors={setErrors} />
        <ApplyCoupon />
      </div>
    </div>
  )
}

export default OrderSummary
