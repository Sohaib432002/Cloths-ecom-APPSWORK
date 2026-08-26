import { Suspense } from 'react'
import { Header, CartItems } from '../components/cart'

const Cart = () => {
  return (
    <div className="mx-auto w-full max-w-310  ">
      {/* Breadcrumb */}
      <div className="pt-5">
        <Header />
      </div>

      {/* Cart Content */}
      <Suspense
        fallback={
          <div className="flex min-h-[200px] items-center justify-center">
            <p className="text-gray-500">Loading cart...</p>
          </div>
        }
      >
        <CartItems />
      </Suspense>
    </div>
  )
}

export default Cart
