'use client'

import { useState } from 'react'
import { useCart } from '@/hooks/usecart'
import { useOrders } from '@/context/OrdersContext'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { FaArrowRight } from 'react-icons/fa6'
import { apiFetch } from '@/lib/client/api'
import type { Order } from '@/context/OrdersContext'
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

export const CheckoutButton = ({
  formData,
  setErrors,
  paymentMethod,
}: {
  formData: FormData
  setErrors?: React.Dispatch<React.SetStateAction<Record<string, string>>>
  paymentMethod: PaymentMethodId
}) => {
  const router = useRouter()
  const { clearCart, cart, coupon } = useCart()
  const { addOrder } = useOrders()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ;['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'zipCode'].forEach((field) => {
      const value = formData[field as keyof FormData]
      if (!value.trim()) newErrors[field] = 'Please fill this field.'
    })
    if (formData.email && !emailOk) newErrors.email = 'Enter a valid email address.'
    if (formData.phone && formData.phone.replace(/\D/g, '').length < 7) {
      newErrors.phone = 'Enter a valid phone number.'
    }
    setErrors?.(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePlaceOrder = async () => {
    setError('')
    if (cart.length === 0) {
      setError('Your cart is empty.')
      return
    }
    if (!validateForm()) return

    setLoading(true)
    try {
      const data = await apiFetch<{ order: Order }>('/api/orders', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          country: formData.country || 'United States',
          paymentMethod,
          couponCode: coupon?.code,
          items: cart.map((item) => ({
            id: item.id,
            slug: item.slug,
            title: item.title,
            image: item.image,
            quantity: item.quantity,
            price: item.price,
            size: item.size,
            color: item.color,
          })),
        }),
      })
      addOrder(data.order)
      clearCart()
      router.push(`/checkout/orderSuccess?orderId=${data.order.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to place this order.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      {!user && (
        <p className="text-sm text-gray-500">
          Guest checkout is available. Sign in if you want the order saved to your account profile.
        </p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="button"
        onClick={() => void handlePlaceOrder()}
        disabled={cart.length === 0 || loading}
        className={`flex w-full items-center justify-center gap-3 rounded-xl py-4 text-lg font-semibold ${
          cart.length === 0 || loading
            ? 'cursor-not-allowed bg-gray-300 text-gray-500'
            : 'bg-black text-white hover:bg-gray-800'
        }`}
      >
        {loading ? 'Placing order...' : 'Place Order'}
        {!loading && <FaArrowRight />}
      </button>
    </div>
  )
}

export default CheckoutButton
