'use client'

import { useState } from 'react'

type Address = {
  id: number
  fullName: string
  phone: string
  address: string
  city: string
  country: string
  zipCode: string
  isDefault: boolean
}

export const Addresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: 1,
      fullName: 'Muhammad Sohaib',
      phone: '+92 300 1234567',
      address: 'Street 25, Gulberg III',
      city: 'Lahore',
      country: 'Pakistan',
      zipCode: '54000',
      isDefault: true,
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
    isDefault: false,
  })

  const [errors, setErrors] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    zipCode: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }))
  }

  const validateForm = () => {
    const newErrors = {
      fullName: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      zipCode: '',
    }

    let isValid = true

    Object.keys(newErrors).forEach((field) => {
      const key = field as keyof typeof newErrors

      if (!formData[key].toString().trim()) {
        newErrors[key] = 'Please fill this field.'
        isValid = false
      }
    })

    setErrors(newErrors)

    return isValid
  }

  const handleSaveAddress = () => {
    if (!validateForm()) return

    if (editingId !== null) {
      setAddresses((prev) =>
        prev.map((item) => {
          if (formData.isDefault) {
            return item.id === editingId ? { ...item, ...formData } : { ...item, isDefault: false }
          }

          return item.id === editingId ? { ...item, ...formData } : item
        })
      )
    } else {
      const newAddress: Address = {
        id: Date.now(),
        ...formData,
      }

      setAddresses((prev) =>
        formData.isDefault
          ? [
              ...prev.map((item) => ({
                ...item,
                isDefault: false,
              })),
              newAddress,
            ]
          : [...prev, newAddress]
      )
    }

    setEditingId(null)

    setFormData({
      fullName: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      zipCode: '',
      isDefault: false,
    })

    setErrors({
      fullName: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      zipCode: '',
    })

    setIsModalOpen(false)
  }

  const handleEdit = (id: number) => {
    const selectedAddress = addresses.find((item) => item.id === id)

    if (!selectedAddress) return

    setEditingId(id)

    setFormData({
      fullName: selectedAddress.fullName,
      phone: selectedAddress.phone,
      address: selectedAddress.address,
      city: selectedAddress.city,
      country: selectedAddress.country,
      zipCode: selectedAddress.zipCode,
      isDefault: selectedAddress.isDefault,
    })

    setIsModalOpen(true)
  }

  const handleDel = (id: number) => {
    setAddresses((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <div className="max-w-8xl col-span-3 py-5 sm:py-8 px-3 sm:px-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold">My Addresses</h1>

        <button
          onClick={() => {
            setEditingId(null)

            setFormData({
              fullName: '',
              phone: '',
              address: '',
              city: '',
              country: '',
              zipCode: '',
              isDefault: false,
            })

            setIsModalOpen(true)
          }}
          className="
          bg-black text-white 
          px-4 py-2 sm:px-6 sm:py-3
          text-sm sm:text-base
          rounded-full 
          hover:bg-gray-800 transition
          w-full sm:w-auto
          "
        >
          + Add New Address
        </button>
      </div>

      {/* Address Cards */}
      {addresses.length !== 0 ? (
        <div
          className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          gap-4 sm:gap-6
          "
        >
          {addresses.map((item) => (
            <div
              key={item.id}
              className="
                border 
                rounded-2xl sm:rounded-3xl
                p-4 sm:p-6
                hover:shadow-lg 
                transition
                "
            >
              <div className="flex justify-between items-start gap-3">
                <div>
                  <h2
                    className="
                    text-base 
                    sm:text-xl 
                    font-bold
                    "
                  >
                    {item.fullName}
                  </h2>

                  {item.isDefault && (
                    <span
                      className="
                      inline-block 
                      mt-2
                      bg-green-100
                      text-green-700
                      text-[10px] sm:text-xs
                      px-2 sm:px-3
                      py-1
                      rounded-full
                      "
                    >
                      Default Address
                    </span>
                  )}
                </div>

                <div
                  className="
                  flex 
                  gap-2 sm:gap-4
                  text-xs sm:text-base
                  "
                >
                  <button
                    onClick={() => handleEdit(item.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDel(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {/* Address Details */}
              <div
                className="
                mt-4 sm:mt-6 
                space-y-1 sm:space-y-2 
                text-gray-600
                text-sm sm:text-base
                "
              >
                <p>
                  <span className="font-semibold text-black">Phone:</span> {item.phone}
                </p>

                <p>
                  <span className="font-semibold text-black">Address:</span> {item.address}
                </p>

                <p>
                  <span className="font-semibold text-black">City:</span> {item.city}
                </p>

                <p>
                  <span className="font-semibold text-black">Country:</span> {item.country}
                </p>

                <p>
                  <span className="font-semibold text-black">ZIP Code:</span> {item.zipCode}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="
          text-center 
          py-10 
          text-gray-500
          text-sm sm:text-base
          "
        >
          No address yet
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div
          className="
        fixed 
        inset-0 
        bg-black/50 
        flex 
        items-center 
        justify-center 
        z-50 
        p-3 sm:p-5
        "
        >
          <div
            className="
          bg-white 
          rounded-2xl sm:rounded-3xl
          shadow-2xl 
          w-full 
          max-w-2xl 
          max-h-[90vh]
          overflow-y-auto
          "
          >
            {/* Modal Header */}
            <div
              className="
            flex 
            justify-between 
            items-center 
            border-b 
            px-4 sm:px-8
            py-3
            "
            >
              <h2
                className="
              text-lg sm:text-2xl
              font-bold
              "
              >
                {editingId ? 'Edit Address' : 'Add New Address'}
              </h2>

              <button
                onClick={() => setIsModalOpen(false)}
                className="
                text-2xl sm:text-3xl
                hover:text-red-500
                "
              >
                ×
              </button>
            </div>

            {/* Body */}
            <div
              className="
            p-4 sm:p-8
            space-y-4 sm:space-y-6
            "
            >
              {/* Name + Phone */}
              <div
                className="
              grid 
              grid-cols-1
              sm:grid-cols-2
              gap-3 sm:gap-5
              "
              >
                <div>
                  <label
                    className="
                  block 
                  mb-1 sm:mb-2 
                  text-sm sm:text-base
                  font-medium
                  "
                  >
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Muhammad Sohaib"
                    className={`
                    w-full 
                    rounded-xl
                    px-3 sm:px-4
                    py-2
                    text-sm sm:text-base
                    outline-none 
                    border
                    ${
                      errors.fullName
                        ? 'border-red-500'
                        : 'border-gray-300 focus:ring-2 focus:ring-black'
                    }
                    `}
                  />

                  {errors.fullName && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label
                    className="
                  block 
                  mb-1 sm:mb-2
                  text-sm sm:text-base
                  font-medium
                  "
                  >
                    Phone Number
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+92 300 1234567"
                    className={`
                    w-full 
                    rounded-xl
                    px-3 sm:px-4
                    py-2
                    text-sm sm:text-base
                    outline-none 
                    border
                    ${
                      errors.phone
                        ? 'border-red-500'
                        : 'border-gray-300 focus:ring-2 focus:ring-black'
                    }
                    `}
                  />

                  {errors.phone && (
                    <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>

              {/* Address */}
              <div>
                <label
                  className="
                block 
                mb-1
                text-sm sm:text-base
                font-medium
                "
                >
                  Address
                </label>

                <textarea
                  rows={3}
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street, House Number..."
                  className={`
                  w-full 
                  rounded-xl
                  px-3 sm:px-4
                  py-2
                  text-sm sm:text-base
                  resize-none
                  outline-none
                  border
                  ${
                    errors.address
                      ? 'border-red-500'
                      : 'border-gray-300 focus:ring-2 focus:ring-black'
                  }
                  `}
                />

                {errors.address && (
                  <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.address}</p>
                )}
              </div>

              {/* City Country Zip */}
              <div
                className="
              grid 
              grid-cols-1
              sm:grid-cols-3
              gap-3 sm:gap-5
              "
              >
                {[
                  {
                    name: 'city',
                    label: 'City',
                    placeholder: 'Lahore',
                  },
                  {
                    name: 'country',
                    label: 'Country',
                    placeholder: 'Pakistan',
                  },
                  {
                    name: 'zipCode',
                    label: 'ZIP Code',
                    placeholder: '54000',
                  },
                ].map((field) => (
                  <div key={field.name}>
                    <label
                      className="
                    block
                    mb-1
                    text-sm sm:text-base
                    font-medium
                    "
                    >
                      {field.label}
                    </label>

                    <input
                      type="text"
                      name={field.name}
                      value={String(formData[field.name as keyof typeof formData] ?? '')}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="
                      w-full
                      rounded-xl
                      px-3 sm:px-4
                      py-2
                      text-sm sm:text-base
                      outline-none
                      border
                      border-gray-300
                      focus:ring-2
                      focus:ring-black
                      "
                    />
                  </div>
                ))}
              </div>

              {/* Default Checkbox */}
              <label
                className="
              flex 
              items-center 
              gap-2 sm:gap-3
              text-sm sm:text-base
              "
              >
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />

                <span>Make this my default address</span>
              </label>
            </div>

            {/* Footer */}
            <div
              className="
            border-t 
            px-4 sm:px-8
            py-3
            flex
            flex-col-reverse
            sm:flex-row
            justify-end
            gap-3 sm:gap-4
            "
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className="
                border
                px-5 sm:px-6
                py-2 sm:py-3
                rounded-xl
                text-sm sm:text-base
                hover:bg-gray-100
                "
              >
                Cancel
              </button>

              <button
                onClick={handleSaveAddress}
                className="
                bg-black
                text-white
                px-6 sm:px-8
                py-2
                rounded-xl
                text-sm sm:text-base
                hover:bg-gray-800
                "
              >
                Save Address
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
