import Link from 'next/link'
import { ArrowRight, Tag, Truck, ShoppingBag } from 'lucide-react'

type CartItem = {
  id: number
  title: string
  price: number
  quantity: number
}

type PropsCart = {
  cart: CartItem[]
}

export const CheckoutDetails = ({ cart }: PropsCart) => {
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  const discountPercentage = 20

  const discount = (subtotal * discountPercentage) / 100

  const deliveryFee = cart.length > 0 ? 15 : 0

  const total = subtotal - discount + deliveryFee

 const formatPrice = (price: number) => {
   return `$${price}`
 }

  if (cart.length === 0) {
    return (
      <div
        className="
      rounded-3xl
      border
      bg-white
      p-8
      text-center
      shadow-sm
      "
      >
        <ShoppingBag
          className="
          mx-auto
          h-16
          w-16
          text-gray-400
          "
        />

        <h2
          className="
        mt-5
        text-2xl
        font-bold
        "
        >
          Your cart is empty
        </h2>

        <p
          className="
        mt-3
        text-gray-500
        "
        >
          Add some products before checkout.
        </p>

        <Link
          href="/Store"
          className="
          mt-6
          inline-flex
          rounded-full
          bg-black
          px-8
          py-3
          text-white
          transition
          hover:bg-gray-800
          "
        >
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div
      className="
      w-full
      rounded-3xl
      border
      border-gray-200
      bg-white
      p-5
      shadow-sm
      sm:p-6
      lg:p-8
      "
    >
      <h2
        className="
        text-2xl
        font-bold
        text-black
        sm:text-3xl
        "
      >
        Order Summary
      </h2>

      <div
        className="
      mt-6
      space-y-5
      "
      >
        <div
          className="
        flex
        items-center
        justify-between
        gap-4
        "
        >
          <span
            className="
          text-sm
          text-gray-500
          sm:text-base
          "
          >
            Subtotal ({cart.length} items)
          </span>

          <span
            className="
          font-semibold
          "
          >
            {formatPrice(subtotal)}
          </span>
        </div>

        <div
          className="
        flex
        items-center
        justify-between
        gap-4
        "
        >
          <div
            className="
          flex
          items-center
          gap-2
          text-sm
          text-gray-500
          sm:text-base
          "
          >
            <Tag size={18} />

            <span>Discount ({discountPercentage}%)</span>
          </div>

          <span
            className="
          font-semibold
          text-red-500
          "
          >
            -{formatPrice(discount)}
          </span>
        </div>

        <div
          className="
        flex
        items-center
        justify-between
        gap-4
        "
        >
          <div
            className="
          flex
          items-center
          gap-2
          text-sm
          text-gray-500
          sm:text-base
          "
          >
            <Truck size={18} />

            <span>Delivery Fee</span>
          </div>

          <span
            className="
          font-semibold
          "
          >
            {formatPrice(deliveryFee)}
          </span>
        </div>
      </div>

      <hr
        className="
      my-7
      border-gray-200
      sm:my-8
      "
      />

      <div
        className="
      flex
      items-center
      justify-between
      "
      >
        <span
          className="
        text-lg
        font-semibold
        sm:text-xl
        "
        >
          Total
        </span>

        <span
          className="
        text-2xl
        font-bold
        sm:text-3xl
        "
        >
          {formatPrice(total)}
        </span>
      </div>

      <div
        className="
      mt-6
      rounded-2xl
      bg-gray-50
      p-4
      text-center
      "
      >
        <p
          className="
        text-sm
        text-gray-600
        "
        >
          🔒 Secure checkout with encrypted payment.
        </p>
      </div>

      <Link
        href="/checkout"
        className="
        mt-6
        flex
        w-full
        items-center
        justify-center
        gap-2
        rounded-full
        bg-black
        py-3.5
        text-base
        font-semibold
        text-white
        transition-all
        duration-300
        hover:bg-gray-800
        hover:scale-[1.02]
        active:scale-95
        sm:py-4
        sm:text-lg
        "
      >
        Proceed to Checkout
        <ArrowRight size={20} />
      </Link>

      <Link
        href="/Store"
        className="
        mt-4
        block
        text-center
        text-sm
        font-medium
        text-gray-500
        transition
        hover:text-black
        "
      >
        Continue Shopping
      </Link>
    </div>
  )
}
