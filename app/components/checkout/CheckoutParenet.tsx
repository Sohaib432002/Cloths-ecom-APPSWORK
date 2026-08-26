'use client'

import { BillingForm } from './BillingForm'
import { OrderSummary } from './OrderSummary'
import { useState } from 'react'

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

export const CheckoutParenet = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  return (
    <section
      className="
      mx-auto
      w-full
      max-w-310
      py-6
      
      
    "
    >
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1
          className="
          text-[16px]
          sm:text-xl
          lg:text-2xl
          font-extrabold
          text-black
        "
        >
          CHECKOUT
        </h1>
      </div>

      {/* Checkout Layout */}

      <div
        className="
    grid
    grid-cols-1
    gap-5
    sm:gap-6
    lg:grid-cols-3
    lg:gap-4
    direction-rtl
  "
      >
        {/* Billing Form */}

        <div className="lg:col-span-2">
          <BillingForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
          />
        </div>

        {/* Order Summary */}

        <div className="lg:col-span-1">
          <div
            className="
            lg:sticky
            lg:top-24
          "
          >
            <OrderSummary formData={formData} errors={errors} setErrors={setErrors} />
          </div>
        </div>
      </div>
    </section>
  )
}

export default CheckoutParenet
