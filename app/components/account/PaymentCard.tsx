'use client'

import Link from 'next/link'
import { Banknote, CreditCard, ShieldCheck } from 'lucide-react'

// Card numbers are never stored on Véora: they are entered on Stripe's hosted page at checkout.
export const PaymentMethods = () => (
  <section aria-labelledby="payments-title">
    <h2 id="payments-title" className="text-2xl font-extrabold">
      Payment methods
    </h2>
    <p className="mt-1 text-sm text-gray-500">Choose how to pay at checkout.</p>

    <div className="mt-6 grid gap-4 md:grid-cols-2">
      <div className="rounded-3xl border border-lavender-200 bg-white p-6">
        <Banknote className="text-brand" />
        <h3 className="mt-3 font-semibold">Cash on Delivery</h3>
        <p className="mt-1 text-sm text-gray-500">Pay in cash when your parcel arrives.</p>
      </div>
      <div className="rounded-3xl border border-lavender-200 bg-white p-6">
        <CreditCard className="text-brand" />
        <h3 className="mt-3 font-semibold">Credit / Debit Card</h3>
        <p className="mt-1 text-sm text-gray-500">Pay securely on Stripe&apos;s page at checkout (when enabled by the store).</p>
      </div>
    </div>

    <p className="mt-6 flex items-start gap-3 rounded-2xl bg-lavender-50 p-4 text-sm text-gray-600">
      <ShieldCheck size={20} className="mt-0.5 shrink-0 text-brand" />
      For your safety we never save card numbers on our website, so there is nothing to manage here.
    </p>
    <Link href="/Store" className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white hover:bg-brand-dark">
      Continue shopping
    </Link>
  </section>
)
