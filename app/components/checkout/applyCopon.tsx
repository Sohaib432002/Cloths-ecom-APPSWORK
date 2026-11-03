'use client'

import { useState } from 'react'
import { Tag } from 'lucide-react'
import { useCart } from '@/hooks/usecart'
import { apiFetch } from '@/lib/client/api'
import type { AppliedCoupon } from '@/types/product'

export const ApplyCoupon = ({ subtotal }: { subtotal: number }) => {
  const { coupon, setCoupon } = useCart()
  const [code, setCode] = useState(coupon?.code || '')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const apply = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await apiFetch<{ coupon: AppliedCoupon }>('/api/coupons', {
        method: 'POST',
        body: JSON.stringify({ code, subtotal }),
      })
      setCoupon(data.coupon)
    } catch (err) {
      setCoupon(null)
      setError(err instanceof Error ? err.message : 'Coupon could not be applied.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Tag size={20} />
        <h3 className="text-lg font-bold">Apply Coupon</h3>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={code}
          onChange={(event) => setCode(event.target.value.toUpperCase())}
          placeholder="WELCOME20"
          className="h-12 w-full rounded-xl border bg-lavender-50 px-4 outline-none focus:border-brand"
        />
        <button
          type="button"
          onClick={() => void apply()}
          disabled={loading}
          className="h-12 rounded-xl bg-brand px-6 text-sm font-semibold text-white disabled:opacity-70"
        >
          {loading ? 'Checking...' : 'Apply'}
        </button>
      </div>
      <p className="mt-3 text-xs text-gray-500">Try WELCOME20, SHOP10, STYLE25, or FREESHIP.</p>
      {coupon && <p className="mt-2 text-sm text-emerald-700">{coupon.label}</p>}
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export default ApplyCoupon
