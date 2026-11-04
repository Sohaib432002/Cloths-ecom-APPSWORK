'use client'

import { BillingForm } from './BillingForm'
import { OrderSummary } from './OrderSummary'
import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { apiFetch } from '@/lib/client/api'
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

export const CheckoutParenet = () => {
  const { user } = useAuth()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('cod')
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: 'Pakistan',
    zipCode: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!user) return
    setFormData((prev) => ({
      ...prev,
      firstName: prev.firstName || user.firstName,
      lastName: prev.lastName || user.lastName,
      email: prev.email || user.email,
      phone: prev.phone || user.phone || '',
    }))
  }, [user])

  // fill the delivery details from the shopper's default saved address
  useEffect(() => {
    if (!user) return
    apiFetch<{ addresses: { fullName: string; phone: string; address: string; city: string; country: string; zipCode: string; isDefault: boolean }[] }>('/api/addresses')
      .then(({ addresses }) => {
        const saved = addresses.find((item) => item.isDefault) || addresses[0]
        if (!saved) return
        setFormData((prev) => ({
          ...prev,
          phone: prev.phone || saved.phone,
          address: prev.address || saved.address,
          city: prev.city || saved.city,
          country: saved.country || prev.country,
          zipCode: prev.zipCode || saved.zipCode,
        }))
      })
      .catch(() => {})
  }, [user])

  return (
    <section className="mx-auto w-full max-w-310 px-4 py-6">
      <h1 className="mb-6 text-2xl font-extrabold">Checkout</h1>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BillingForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />
        </div>
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <OrderSummary
              formData={formData}
              errors={errors}
              setErrors={setErrors}
              paymentMethod={paymentMethod}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default CheckoutParenet
