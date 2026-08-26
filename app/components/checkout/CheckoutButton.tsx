'use client'

import { useState } from 'react'
import { useCart } from '@/hooks/usecart'
import { useOrders } from '@/context/OrdersContext'
import { useRouter } from 'next/navigation'
import { FaArrowRight } from 'react-icons/fa6'

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

type CheckoutButtonProps = {
  formData: FormData
  setErrors?: React.Dispatch<React.SetStateAction<Record<string, string>>>
}

export const CheckoutButton = ({ formData, setErrors }: CheckoutButtonProps) => {
  const router = useRouter()

  const { clearCart, cart } = useCart()

  const { addOrder } = useOrders()

  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city']

    requiredFields.forEach((field) => {
      const value = formData[field as keyof FormData]

      if (typeof value === 'string' && !value.trim()) {
        newErrors[field] = 'Please fill this field.'
      }
    })

    if (setErrors) {
      setErrors(newErrors)
    }

    return Object.keys(newErrors).length === 0
  }

  const handlePlaceOrder = () => {
    // Check Login
    // const loginDetails = localStorage.getItem('Login Details')

    // if (!loginDetails) {
    //   alert('Please login to place your order.')
    //   router.push('/login')
    //   return
    // }

    // Check Cart
    if (cart.length === 0) {
      alert('Your cart is empty.')
      return
    }

    // Validate Form
    const isValid = validateForm()

    if (!isValid) {
      return
    }

    setLoading(true)

    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

    const discount = (subtotal * 20) / 100

    const deliveryFee = 15

    const total = subtotal - discount + deliveryFee

    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`

    const newOrder = {
      id: orderId,

      status: 'Processing',

      date: new Date().toLocaleDateString('en-GB'),

      payment: 'Cash On Delivery',

      shipping: 'Standard Shipping',

      items: cart.map((item) => ({
        id: item.id,
        title: item.title,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
      })),

      address: {
        name: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        zipCode: formData.zipCode,
      },

      subtotal,
      discount,
      deliveryFee,
      total,
    }

    addOrder(newOrder)

    setTimeout(() => {
      clearCart()
      router.push(`/checkout/orderSuccess?orderId=${orderId}`)
    }, 500)
  }

  return (
    <button
      onClick={handlePlaceOrder}
      disabled={cart.length === 0 || loading}
      className={`

      flex
      w-full
      items-center
      justify-center
      gap-3
      rounded-xl
      py-3
      sm:py-4
      text-sm
      sm:text-lg
      font-semibold
      transition-all
      duration-300


      ${
        cart.length === 0 || loading
          ? 'cursor-not-allowed bg-gray-300 text-gray-500'
          : 'bg-black text-white hover:bg-gray-800 hover:scale-[1.02] active:scale-[0.98]'
      }

      `}
    >
      {loading ? 'Processing...' : 'Place Order'}

      {!loading && <FaArrowRight className="text-sm sm:text-base" />}
    </button>
  )
}

export default CheckoutButton
