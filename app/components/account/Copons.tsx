'use client'

import { useEffect, useState } from 'react'
import { apiFetch } from '@/lib/client/api'

type Coupon = { code: string; label: string; description: string }

export const Coupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([])

  useEffect(() => {
    apiFetch<{ coupons: Coupon[] }>('/api/coupons')
      .then((data) => setCoupons(data.coupons))
      .catch(() => setCoupons([]))
  }, [])

  return (
    <div className="space-y-4">
      <div className="rounded-3xl bg-brand p-6 text-white">
        <h1 className="text-3xl font-bold">Coupons</h1>
        <p className="mt-2 text-gray-300">Apply these codes at checkout to reduce your order total.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {coupons.map((coupon) => (
          <div key={coupon.code} className="rounded-3xl border p-6">
            <p className="text-sm uppercase tracking-widest text-gray-500">Code</p>
            <h2 className="mt-1 text-2xl font-black">{coupon.code}</h2>
            <p className="mt-2 font-semibold">{coupon.label}</p>
            <p className="mt-2 text-sm text-gray-500">{coupon.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
