'use client'

import { useState } from 'react'

export const PaymentMethod = () => {
  const [payment, setPayment] = useState('cod')
  const [cardType, setCardType] = useState('visa')
  const [showPayment, setShowPayment] = useState(false)

  return (
    <div className="mt-8">
      {/* Heading */}
      <div className="mb-6">
        <h2 className="text-xl font-bold sm:text-2xl">Payment Method</h2>

        <p className="mt-2 text-sm text-gray-500 sm:text-base">
          Choose your preferred payment option.
        </p>
      </div>

      {/* Mobile Toggle */}
      <div className="mb-5 sm:hidden">
        <button
          onClick={() => setShowPayment(!showPayment)}
          className="flex w-full items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-4 shadow-sm"
        >
          <span className="font-semibold">
            {payment === 'cod'
              ? 'Cash on Delivery'
              : payment === 'card'
                ? 'Credit / Debit Card'
                : 'PayPal'}
          </span>

          <i
            className={`fa-solid fa-chevron-down transition-transform duration-300 ${
              showPayment ? 'rotate-180' : ''
            }`}
          ></i>
        </button>
      </div>

      {/* Payment Options */}
      <div className={`${showPayment ? 'block' : 'hidden'} sm:block`}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Cash on Delivery */}
          <label
            className={`cursor-pointer rounded-2xl border p-5 transition ${
              payment === 'cod' ? 'border-black bg-gray-100' : 'border-gray-300 hover:border-black'
            }`}
          >
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={payment === 'cod'}
              onChange={(e) => setPayment(e.target.value)}
              className="hidden"
            />

            <i className="fa-solid fa-money-bill-wave mb-4 text-3xl"></i>

            <h3 className="font-semibold">Cash on Delivery</h3>

            <p className="mt-2 text-sm text-gray-500">Pay when your parcel arrives.</p>
          </label>

          {/* Card */}
          <label
            className={`cursor-pointer rounded-2xl border p-5 transition ${
              payment === 'card' ? 'border-black bg-gray-100' : 'border-gray-300 hover:border-black'
            }`}
          >
            <input
              type="radio"
              name="payment"
              value="card"
              checked={payment === 'card'}
              onChange={(e) => setPayment(e.target.value)}
              className="hidden"
            />

            <i className="fa-regular fa-credit-card mb-4 text-3xl"></i>

            <h3 className="font-semibold">Credit / Debit Card</h3>

            <p className="mt-2 text-sm text-gray-500">Visa, Mastercard & more.</p>
          </label>

          {/* PayPal */}
          <label
            className={`cursor-pointer rounded-2xl border p-5 transition ${
              payment === 'paypal'
                ? 'border-black bg-gray-100'
                : 'border-gray-300 hover:border-black'
            }`}
          >
            <input
              type="radio"
              name="payment"
              value="paypal"
              checked={payment === 'paypal'}
              onChange={(e) => setPayment(e.target.value)}
              className="hidden"
            />

            <i className="fa-brands fa-paypal mb-4 text-3xl"></i>

            <h3 className="font-semibold">PayPal</h3>

            <p className="mt-2 text-sm text-gray-500">Fast & secure payment.</p>
          </label>
        </div>

        {/* Card Types */}
        {payment === 'card' && (
          <div className="mt-6 rounded-2xl border border-gray-200 p-5 sm:p-6">
            <h3 className="mb-5 text-lg font-semibold">Select Your Card</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <label
                className={`cursor-pointer rounded-xl border p-4 transition ${
                  cardType === 'visa'
                    ? 'border-black bg-gray-100'
                    : 'border-gray-300 hover:border-black'
                }`}
              >
                <input
                  type="radio"
                  name="cardType"
                  value="visa"
                  checked={cardType === 'visa'}
                  onChange={(e) => setCardType(e.target.value)}
                  className="mr-2"
                />
                💳 Visa
              </label>

              <label
                className={`cursor-pointer rounded-xl border p-4 transition ${
                  cardType === 'master'
                    ? 'border-black bg-gray-100'
                    : 'border-gray-300 hover:border-black'
                }`}
              >
                <input
                  type="radio"
                  name="cardType"
                  value="master"
                  checked={cardType === 'master'}
                  onChange={(e) => setCardType(e.target.value)}
                  className="mr-2"
                />
                💳 MasterCard
              </label>

              <label
                className={`cursor-pointer rounded-xl border p-4 transition ${
                  cardType === 'amex'
                    ? 'border-black bg-gray-100'
                    : 'border-gray-300 hover:border-black'
                }`}
              >
                <input
                  type="radio"
                  name="cardType"
                  value="amex"
                  checked={cardType === 'amex'}
                  onChange={(e) => setCardType(e.target.value)}
                  className="mr-2"
                />
                💳 American Express
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PaymentMethod
