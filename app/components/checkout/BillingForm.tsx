'use client'

import React, { Dispatch, SetStateAction } from 'react'
import { User, Mail, Phone, MapPin, Building2, Globe, Hash, LucideIcon } from 'lucide-react'

import { PaymentMethod } from './PaymentMethod'
import type { PaymentMethodId } from '@/types/product'

type CheckoutFormData = {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  zipCode: string
}

type BillingFormProps = {
  formData: CheckoutFormData
  setFormData: Dispatch<SetStateAction<CheckoutFormData>>
  errors: Record<string, string>
  setErrors: Dispatch<SetStateAction<Record<string, string>>>
  paymentMethod: PaymentMethodId
  setPaymentMethod: Dispatch<SetStateAction<PaymentMethodId>>
}

export const BillingForm = ({
  formData,
  setFormData,
  errors,
  setErrors,
  paymentMethod,
  setPaymentMethod,
}: BillingFormProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  return (
    <div
      className="
      rounded-3xl
      border
      border-gray-200
      bg-white
      p-4
      sm:p-6
      lg:p-8
      shadow-sm
      "
    >
      {/* Header */}

      <div className="mb-6 sm:mb-8">
        <h2
          className="
          text-xl
          sm:text-2xl
          font-bold
          "
        >
          Billing Details
        </h2>

        <p
          className="
          mt-2
          text-sm
          sm:text-base
          text-gray-500
          "
        >
          Please fill in your billing information to complete your purchase.
        </p>
      </div>

      {/* Inputs */}

      <div
        className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-4
        sm:gap-6
        "
      >
        <InputField
          icon={User}
          label="First Name"
          name="firstName"
          value={formData.firstName}
          placeholder="John"
          error={errors.firstName}
          onChange={handleChange}
        />

        <InputField
          icon={User}
          label="Last Name"
          name="lastName"
          value={formData.lastName}
          placeholder="Doe"
          error={errors.lastName}
          onChange={handleChange}
        />

        <InputField
          icon={Mail}
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          placeholder="john@example.com"
          error={errors.email}
          onChange={handleChange}
        />

        <InputField
          icon={Phone}
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          placeholder="+92 300 1234567"
          error={errors.phone}
          onChange={handleChange}
        />

        <div className="md:col-span-2">
          <InputField
            icon={MapPin}
            label="Street Address"
            name="address"
            value={formData.address}
            placeholder="House No, Street, Area"
            error={errors.address}
            onChange={handleChange}
          />
        </div>

        <InputField
          icon={Building2}
          label="City"
          name="city"
          value={formData.city}
          placeholder="Lahore"
          error={errors.city}
          onChange={handleChange}
        />

        <InputField
          icon={Globe}
          label="Country (Optional)"
          name="country"
          value={formData.country}
          placeholder="Pakistan"
          onChange={handleChange}
        />

        <div className="md:col-span-2">
          <InputField
            icon={Hash}
            label="ZIP Code (Optional)"
            name="zipCode"
            value={formData.zipCode}
            placeholder="54000"
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Payment */}

      <div
        className="
        mt-8
        sm:mt-10
        border-t
        pt-6
        sm:pt-8
        "
      >
        <PaymentMethod value={paymentMethod} onChange={setPaymentMethod} />
      </div>
    </div>
  )
}

type InputProps = {
  icon: LucideIcon
  label: string
  name: string
  value: string
  placeholder: string
  type?: string
  error?: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const InputField = ({
  icon: Icon,
  label,
  name,
  value,
  placeholder,
  type = 'text',
  error,
  onChange,
}: InputProps) => {
  return (
    <div>
      <label
        className="
        mb-2
        block
        text-sm
        sm:text-base
        font-semibold
        text-gray-700
        "
      >
        {label}

        {!label.includes('Optional') && <span className="text-red-500">*</span>}
      </label>

      <div
        className={`
        flex
        items-center
        gap-2
        sm:gap-3
        rounded-xl
        sm:rounded-2xl
        border
        px-3
        sm:px-5
        py-3
        sm:py-4
        
        ${error ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-lavender-50'}
        `}
      >
        <Icon
          size={18}
          className="
          shrink-0
          text-gray-400
          sm:w-5
          sm:h-5
          "
        />

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="
          w-full
          bg-transparent
          outline-none
          text-sm
          sm:text-base
          "
        />
      </div>

      {error && (
        <p
          className="
          mt-1
          text-sm
          text-red-500
          "
        >
          {error}
        </p>
      )}
    </div>
  )
}
