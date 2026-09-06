'use client'

import type { PaymentMethodId } from '@/types/product'

const OPTIONS: { id: PaymentMethodId; title: string; description: string }[] = [
  { id: 'cod', title: 'Cash on Delivery', description: 'Pay when your parcel arrives.' },
  { id: 'card', title: 'Credit / Debit Card', description: 'Visa, Mastercard and more.' },
  { id: 'paypal', title: 'PayPal', description: 'Fast and secure checkout.' },
]

export const PaymentMethod = ({
  value,
  onChange,
}: {
  value: PaymentMethodId
  onChange: (value: PaymentMethodId) => void
}) => {
  return (
    <fieldset className="mt-8">
      <legend className="text-xl font-bold sm:text-2xl">Payment Method</legend>
      <p className="mt-2 text-sm text-gray-500">Choose how you would like to pay.</p>
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        {OPTIONS.map((option) => (
          <label
            key={option.id}
            className={`cursor-pointer rounded-2xl border p-5 ${
              value === option.id ? 'border-black bg-gray-100' : 'border-gray-300'
            }`}
          >
            <input
              type="radio"
              name="payment"
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
              className="sr-only"
            />
            <h3 className="font-semibold">{option.title}</h3>
            <p className="mt-2 text-sm text-gray-500">{option.description}</p>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export default PaymentMethod
