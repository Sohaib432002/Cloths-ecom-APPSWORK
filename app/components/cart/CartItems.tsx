'use client'

import { Item } from './Item'
import { CheckoutDetails } from './CheckoutDetails'
import { useCart } from '@/hooks/usecart'

export const CartItems = () => {
  const { cart } = useCart()

  return (
    <div className="mx-auto w-full max-w-310  py-8 ">
      {cart.length === 0 ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <h2 className="text-xl font-semibold text-gray-500">No Products inside the cart</h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="order-2 lg:order-1 lg:col-span-2">
            {cart.map((item) => (
              <Item key={item.id} item={item} />
            ))}
          </div>

          {/* Checkout Details */}
          <div className="order-1 lg:order-2 lg:col-span-1">
            <div className="sticky top-24">
              <CheckoutDetails cart={cart} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
