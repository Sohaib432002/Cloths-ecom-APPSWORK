'use client'

import { useEffect, useState } from 'react'
import { Banknote, CreditCard, Lock } from 'lucide-react'
import { apiFetch } from '@/lib/client/api'
import type { PaymentMethodId } from '@/types/product'

type Config = { payments: { cod: boolean; card: boolean } }

export const PaymentMethod = ({
  value,
  onChange,
}: {
  value: PaymentMethodId
  onChange: (value: PaymentMethodId) => void
}) => {
  const [config, setConfig] = useState<Config | null>(null)

  useEffect(() => {
    apiFetch<Config>('/api/config')
      .then(setConfig)
      .catch(() => setConfig({ payments: { cod: true, card: false } }))
  }, [])

  const options = [
    {
      id: 'cod' as const,
      title: 'Cash on Delivery',
      description: 'Pay in cash when your parcel arrives.',
      Icon: Banknote,
      enabled: true,
    },
    {
      id: 'card' as const,
      title: 'Credit / Debit Card',
      description: 'Visa and Mastercard on a secure Stripe page.',
      Icon: CreditCard,
      enabled: Boolean(config?.payments.card),
    },
  ]

  // fall back to cash on delivery if the saved selection is not available
  useEffect(() => {
    if (config && value === 'card' && !config.payments.card) onChange('cod')
  }, [config, value, onChange])

  return (
    <fieldset className="mt-8">
      <legend className="text-xl font-bold sm:text-2xl">Payment Method</legend>
      <p className="mt-2 text-sm text-gray-500">Choose how you would like to pay.</p>
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        {options.map(({ id, title, description, Icon, enabled }) => (
          <label
            key={id}
            className={`relative rounded-2xl border p-5 transition ${
              !enabled
                ? 'cursor-not-allowed border-lavender-200 bg-lavender-50 opacity-60'
                : value === id
                  ? 'cursor-pointer border-brand bg-lavender-100 ring-1 ring-brand'
                  : 'cursor-pointer border-lavender-200 hover:border-brand-soft'
            }`}
          >
            <input
              type="radio"
              name="payment"
              value={id}
              checked={value === id}
              disabled={!enabled}
              onChange={() => onChange(id)}
              className="sr-only"
            />
            <Icon size={22} className="text-brand" />
            <h3 className="mt-3 font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
            {!enabled && <p className="mt-2 text-xs font-medium text-gray-500">Not available yet</p>}
          </label>
        ))}
      </div>
      <p className="mt-4 flex items-center gap-2 text-xs text-gray-500">
        <Lock size={13} /> Card details are entered on Stripe&apos;s secure page. Véora never sees or stores your card number.
      </p>
    </fieldset>
  )
}

export default PaymentMethod
