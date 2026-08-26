'use client'

import { useState } from 'react'

type Coupon = {
  id: number
  code: string
  discount: string
  description: string
  expiry: string
  status: 'Active' | 'Expired'
}

export const Coupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: 1,
      code: 'WELCOME20',
      discount: '20% OFF',
      description: 'Applicable on your first purchase.',
      expiry: '31 Dec 2026',
      status: 'Active',
    },
    {
      id: 2,
      code: 'SUMMER15',
      discount: '15% OFF',
      description: 'Valid on orders above $100.',
      expiry: '15 Aug 2026',
      status: 'Active',
    },
    {
      id: 3,
      code: 'SAVE50',
      discount: '$50 OFF',
      description: 'Flat discount on premium products.',
      expiry: '01 Jan 2026',
      status: 'Expired',
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [editingId, setEditingId] = useState<number | null>(null)

  const [couponCode, setCouponCode] = useState('')

  const [formData, setFormData] = useState({
    code: '',
    discount: '',
    description: '',
    expiry: '',
    status: 'Active' as 'Active' | 'Expired',
  })

  const [errors, setErrors] = useState({
    code: '',
    discount: '',
    description: '',
    expiry: '',
  })

  const resetForm = () => {
    setEditingId(null)

    setFormData({
      code: '',
      discount: '',
      description: '',
      expiry: '',
      status: 'Active',
    })

    setErrors({
      code: '',
      discount: '',
      description: '',
      expiry: '',
    })
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }))
  }

  const validateForm = () => {
    const newErrors = {
      code: '',
      discount: '',
      description: '',
      expiry: '',
    }

    let valid = true

    Object.keys(newErrors).forEach((key) => {
      const field = key as keyof typeof newErrors

      if (!formData[field].trim()) {
        newErrors[field] = 'Please fill this field.'
        valid = false
      }
    })

    setErrors(newErrors)

    return valid
  }

  const handleSaveCoupon = () => {
    if (!validateForm()) return

    if (editingId !== null) {
      setCoupons((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...formData,
              }
            : item
        )
      )
    } else {
      const newCoupon: Coupon = {
        id: Date.now(),
        ...formData,
      }

      setCoupons((prev) => [...prev, newCoupon])
    }

    resetForm()

    setIsModalOpen(false)
  }

  const handleEdit = (id: number) => {
    const coupon = coupons.find((item) => item.id === id)

    if (!coupon) return

    setEditingId(id)

    setFormData({
      code: coupon.code,
      discount: coupon.discount,
      description: coupon.description,
      expiry: coupon.expiry,
      status: coupon.status,
    })

    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    setCoupons((prev) => prev.filter((item) => item.id !== id))
  }

  const handleRedeem = () => {
    if (!couponCode.trim()) {
      alert('Please enter coupon code.')
      return
    }

    const coupon = coupons.find(
      (item) => item.code.toLowerCase() === couponCode.toLowerCase() && item.status === 'Active'
    )

    if (coupon) {
      alert(`${coupon.code} applied successfully.`)
      setCouponCode('')
    } else {
      alert('Invalid or expired coupon.')
    }
  }

  return (
    <div
      className="
    space-y-5
    sm:space-y-8
    col-span-3
    px-2
    sm:px-0
    "
    >
      {/* Header */}

      <div
        className="
      flex
      flex-col
      gap-4
      md:flex-row
      md:items-center
      md:justify-between
      "
      >
        <div>
          <h1
            className="
          text-xl
          sm:text-3xl
          font-bold
          "
          >
            My Coupons
          </h1>

          <p
            className="
          mt-1
          sm:mt-2
          text-sm
          sm:text-base
          text-gray-500
          "
          >
            Manage and redeem your available discount coupons.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm()
            setIsModalOpen(true)
          }}
          className="
        rounded-full
        bg-black
        px-4
        py-2
        sm:px-6
        sm:py-3
        text-sm
        sm:text-base
        text-white
        hover:bg-gray-800
        w-full
        md:w-auto
        "
        >
          + Add Coupon
        </button>
      </div>

      {/* Coupon List */}

      {coupons.length > 0 ? (
        <div
          className="
        space-y-4
        sm:space-y-6
        "
        >
          {coupons.map((coupon) => (
            <div
              key={coupon.id}
              className="
          rounded-2xl
          sm:rounded-3xl
          border
          bg-white
          p-4
          sm:p-6
          transition
          hover:shadow-lg
          "
            >
              <div
                className="
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
          "
              >
                {/* Left */}

                <div
                  className="
          space-y-2
          sm:space-y-3
          "
                >
                  <div
                    className="
            flex
            flex-wrap
            items-center
            gap-2
            sm:gap-3
            "
                  >
                    <h2
                      className="
              text-lg
              sm:text-2xl
              font-bold
              tracking-widest
              "
                    >
                      {coupon.code}
                    </h2>

                    <span
                      className={`

              rounded-full

              px-3
              sm:px-4

              py-1

              text-xs
              sm:text-sm

              font-semibold


              ${
                coupon.status === 'Active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-600'
              }

              `}
                    >
                      {coupon.status}
                    </span>
                  </div>

                  <h3
                    className="
            text-2xl
            sm:text-3xl
            font-black
            text-green-600
            "
                  >
                    {coupon.discount}
                  </h3>

                  <p
                    className="
            text-sm
            sm:text-base
            text-gray-500
            "
                  >
                    {coupon.description}
                  </p>

                  <p
                    className="
            text-xs
            sm:text-sm
            text-gray-400
            "
                  >
                    Expires on {coupon.expiry}
                  </p>
                </div>

                {/* Right Buttons */}

                <div
                  className="
          flex
          flex-wrap
          gap-2
          sm:gap-3
          "
                >
                  <button
                    disabled={coupon.status === 'Expired'}
                    className={`

            rounded-full

            px-4
            sm:px-6

            py-1.5
            sm:py-2

            text-xs
            sm:text-sm


            ${
              coupon.status === 'Active'
                ? 'bg-black text-white hover:bg-gray-800'
                : 'cursor-not-allowed bg-gray-300 text-gray-500'
            }

            `}
                  >
                    {coupon.status === 'Active' ? 'Use Coupon' : 'Expired'}
                  </button>

                  <button
                    onClick={() => handleEdit(coupon.id)}
                    className="
            rounded-full
            border
            border-black
            px-4
            sm:px-6
            py-1.5
            sm:py-2
            text-xs
            sm:text-sm
            hover:bg-black
            hover:text-white
            "
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(coupon.id)}
                    className="
            rounded-full
            border
            border-red-500
            px-4
            sm:px-6
            py-1.5
            sm:py-2
            text-xs
            sm:text-sm
            text-red-500
            hover:bg-red-500
            hover:text-white
            "
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="
        rounded-3xl
        border
        border-dashed
        py-10
        sm:py-16
        text-center
        "
        >
          <div
            className="
          text-4xl
          sm:text-6xl
          "
          >
            🎁
          </div>

          <h2
            className="
          mt-3
          sm:mt-4
          text-xl
          sm:text-2xl
          font-bold
          "
          >
            No Coupons Available
          </h2>

          <p
            className="
          mt-2
          text-sm
          sm:text-base
          text-gray-500
          "
          >
            Add your first coupon to start saving.
          </p>
        </div>
      )}
      {/* Redeem Coupon */}

      <div
        className="
      rounded-2xl
      sm:rounded-3xl
      border
      bg-gray-50
      p-4
      sm:p-8
      "
      >
        <h2
          className="
        text-lg
        sm:text-2xl
        font-bold
        "
        >
          Redeem Coupon
        </h2>

        <p
          className="
        mt-1
        sm:mt-2
        text-sm
        sm:text-base
        text-gray-500
        "
        >
          Already have a coupon? Enter it below.
        </p>

        <div
          className="
        mt-4
        sm:mt-6
        flex
        flex-col
        gap-3
        sm:flex-row
        "
        >
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
            className="
          flex-1
          rounded-full
          border
          bg-white
          px-4
          sm:px-6
          py-2
          text-sm
          sm:text-base
          outline-none
          focus:ring-2
          focus:ring-black
          "
          />

          <button
            onClick={handleRedeem}
            className="
          rounded-full
          bg-black
          px-6
          sm:px-8
          py-2
          text-sm
          sm:text-base
          text-white
          hover:bg-gray-800
          "
          >
            Redeem
          </button>
        </div>
      </div>

      {/* Add / Edit Coupon Modal */}

      {isModalOpen && (
        <div
          className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/50
        p-3
        sm:p-5
        "
        >
          <div
            className="
          w-full
          max-w-2xl
          max-h-[90vh]
          overflow-y-auto
          rounded-2xl
          sm:rounded-3xl
          bg-white
          shadow-2xl
          "
          >
            {/* Header */}

            <div
              className="
          flex
          items-center
          justify-between
          border-b
          px-4
          sm:px-8
          py-3
          "
            >
              <div>
                <h2
                  className="
              text-lg
              sm:text-2xl
              font-bold
              "
                >
                  {editingId ? 'Edit Coupon' : 'Add Coupon'}
                </h2>

                <p
                  className="
              mt-1
              text-xs
              sm:text-sm
              text-gray-500
              "
                >
                  Create or update your discount coupon.
                </p>
              </div>

              <button
                onClick={() => {
                  resetForm()
                  setIsModalOpen(false)
                }}
                className="
            text-2xl
            sm:text-3xl
            hover:text-red-500
            "
              >
                ×
              </button>
            </div>

            {/* Body */}

            <div
              className="
          space-y-4
          sm:space-y-6
          p-4
          sm:p-8
          "
            >
              {/* Coupon Code */}

              <div>
                <label
                  className="
            mb-1
            sm:mb-2
            block
            text-sm
            sm:text-base
            font-medium
            "
                >
                  Coupon Code
                </label>

                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="WELCOME20"
                  className={`

            w-full

            rounded-xl

            border

            px-3
            sm:px-4

            py-2

            text-sm
            sm:text-base

            outline-none


            ${errors.code ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-black'}

            `}
                />

                {errors.code && (
                  <p
                    className="
              mt-1
              text-xs
              sm:text-sm
              text-red-500
              "
                  >
                    {errors.code}
                  </p>
                )}
              </div>

              {/* Discount */}

              <div>
                <label
                  className="
            mb-1
            sm:mb-2
            block
            text-sm
            sm:text-base
            font-medium
            "
                >
                  Discount
                </label>

                <input
                  type="text"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  placeholder="20% OFF"
                  className={`

            w-full

            rounded-xl

            border

            px-3
            sm:px-4

            py-2

            text-sm
            sm:text-base

            outline-none


            ${errors.discount ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-black'}

            `}
                />

                {errors.discount && (
                  <p
                    className="
              mt-1
              text-xs
              sm:text-sm
              text-red-500
              "
                  >
                    {errors.discount}
                  </p>
                )}
              </div>

              {/* Description */}

              <div>
                <label
                  className="
            mb-1
            sm:mb-2
            block
            text-sm
            sm:text-base
            font-medium
            "
                >
                  Description
                </label>

                <textarea
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe this coupon..."
                  className={`

            w-full

            resize-none

            rounded-xl

            border

            px-3
            sm:px-4

            py-2

            text-sm
            sm:text-base

            outline-none


            ${
              errors.description
                ? 'border-red-500'
                : 'border-gray-300 focus:ring-2 focus:ring-black'
            }

            `}
                />

                {errors.description && (
                  <p
                    className="
              mt-1
              text-xs
              sm:text-sm
              text-red-500
              "
                  >
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Expiry + Status */}

              <div
                className="
          grid
          grid-cols-1
          sm:grid-cols-2
          gap-3
          sm:gap-5
          "
              >
                <div>
                  <label
                    className="
              mb-1
              sm:mb-2
              block
              text-sm
              sm:text-base
              font-medium
              "
                  >
                    Expiry Date
                  </label>

                  <input
                    type="text"
                    name="expiry"
                    value={formData.expiry}
                    onChange={handleChange}
                    placeholder="31 Dec 2026"
                    className="

              w-full

              rounded-xl

              border

              border-gray-300

              px-3

              sm:px-4

              py-2

              text-sm

              sm:text-base

              outline-none

              focus:ring-2

              focus:ring-black

              "
                  />
                </div>

                <div>
                  <label
                    className="
              mb-1
              sm:mb-2
              block
              text-sm
              sm:text-base
              font-medium
              "
                  >
                    Status
                  </label>

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="

              w-full

              rounded-xl

              border

              border-gray-300

              px-3

              sm:px-4

              py-2

              text-sm

              sm:text-base

              outline-none

              focus:ring-2

              focus:ring-black

              "
                  >
                    <option value="Active">Active</option>

                    <option value="Expired">Expired</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}

            <div
              className="
          flex
          flex-col-reverse
          sm:flex-row
          justify-end
          gap-3
          sm:gap-4
          border-t
          px-4
          sm:px-8
          py-3
          "
            >
              <button
                onClick={() => {
                  resetForm()
                  setIsModalOpen(false)
                }}
                className="
            rounded-xl
            border
            px-5
            sm:px-6
            py-2
            text-sm
            sm:text-base
            hover:bg-gray-100
            "
              >
                Cancel
              </button>

              <button
                onClick={handleSaveCoupon}
                className="
            rounded-xl
            bg-black
            px-6
            sm:px-8
            py-2
            text-sm
            sm:text-base
            text-white
            hover:bg-gray-800
            "
              >
                {editingId ? 'Update Coupon' : 'Save Coupon'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}