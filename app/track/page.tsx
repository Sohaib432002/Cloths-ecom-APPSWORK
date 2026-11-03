import type { Metadata } from 'next'
import { Suspense } from 'react'
import { TrackOrder } from './TrackOrder'

export const metadata: Metadata = {
  title: 'Track your order',
  description: 'Check the status of your Véora order with your order number and email.',
}

export default function TrackPage() {
  return (
    <div className="mx-auto max-w-2xl py-14">
      <p className="eyebrow">Order tracking</p>
      <h1 className="mt-3 text-4xl font-extrabold">Where is my order?</h1>
      <p className="mt-3 text-gray-600">Enter the order number from your confirmation and the email you ordered with.</p>
      <Suspense fallback={null}>
        <TrackOrder />
      </Suspense>
    </div>
  )
}
