'use client'

import { useState } from 'react'
import { Tag } from 'lucide-react'

export const ApplyCoupon = () => {
  const [coupon, setCoupon] = useState('')

  const handleApplyCoupon = () => {
    if (!coupon.trim()) {
      alert('Please enter a coupon code.')
      return
    }

    console.log('Coupon Applied:', coupon)
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Tag size={20} className="text-gray-700" />
        <h3 className="text-lg font-bold text-gray-900">Apply Coupon</h3>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Input */}
        <div className="sm:flex-[4]">
          <input
            type="text"
            placeholder="Enter coupon code"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            className="
              h-12
              w-full
              rounded-xl
              border
              border-gray-300
              bg-gray-50
              px-4
              text-sm
              outline-none
              transition-all
              duration-200
              placeholder:text-gray-400
              focus:border-black
              focus:bg-white
              focus:ring-4
              focus:ring-black/10
            "
          />
        </div>

        {/* Button */}
        <div className="sm:flex-1 sm:max-w-[140px]">
          <button
            onClick={handleApplyCoupon}
            className="
              h-12
              w-full
              rounded-xl
              bg-black
              px-6
              text-sm
              font-semibold
              text-white
              transition-all
              duration-200
              hover:scale-[1.02]
              hover:bg-gray-800
              active:scale-95
            "
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}

export default ApplyCoupon
