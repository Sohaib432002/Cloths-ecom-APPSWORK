'use client'

import { useState } from 'react'

type PaymentMethod = {
  id: number
  cardHolder: string
  cardNumber: string
  expiry: string
  cardType: 'Visa' | 'MasterCard'
  isDefault: boolean
}

export const PaymentMethods = () => {
  const [cards, setCards] = useState<PaymentMethod[]>([
    {
      id: 1,
      cardHolder: 'Muhammad Sohaib',
      cardNumber: '4242424242424242',
      expiry: '12/27',
      cardType: 'Visa',
      isDefault: true,
    },
    {
      id: 2,
      cardHolder: 'Muhammad Sohaib',
      cardNumber: '5555555555559876',
      expiry: '08/29',
      cardType: 'MasterCard',
      isDefault: false,
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    cardHolder: '',
    cardNumber: '',
    expiry: '',
    cardType: 'Visa' as 'Visa' | 'MasterCard',
    isDefault: false,
  })

  const [errors, setErrors] = useState({
    cardHolder: '',
    cardNumber: '',
    expiry: '',
    cardType: '',
  })

  const resetForm = () => {
    setEditingId(null)

    setFormData({
      cardHolder: '',
      cardNumber: '',
      expiry: '',
      cardType: 'Visa',
      isDefault: false,
    })

    setErrors({
      cardHolder: '',
      cardNumber: '',
      expiry: '',
      cardType: '',
    })
  }

  const maskCardNumber = (number: string) => {
    return `**** **** **** ${number.slice(-4)}`
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target

    setFormData((prev) => ({
      ...prev,
      [target.name]:
        target instanceof HTMLInputElement && target.type === 'checkbox'
          ? target.checked
          : target.value,
    }))
  }

  const validateForm = () => {
    const newErrors = {
      cardHolder: '',
      cardNumber: '',
      expiry: '',
      cardType: '',
    }

    let valid = true

    Object.keys(newErrors).forEach((key) => {
      const field = key as keyof typeof newErrors

      if (!formData[field].toString().trim()) {
        newErrors[field] = 'Please fill this field.'
        valid = false
      }
    })

    setErrors(newErrors)

    return valid
  }

  const handleSaveCard = () => {
    if (!validateForm()) return

    if (editingId) {
      setCards((prev) =>
        prev.map((item) => {
          if (formData.isDefault) {
            return item.id === editingId ? { ...item, ...formData } : { ...item, isDefault: false }
          }

          return item.id === editingId ? { ...item, ...formData } : item
        })
      )
    } else {
      const newCard: PaymentMethod = {
        id: Date.now(),
        ...formData,
      }

      setCards((prev) =>
        formData.isDefault
          ? [
              ...prev.map((item) => ({
                ...item,
                isDefault: false,
              })),
              newCard,
            ]
          : [...prev, newCard]
      )
    }

    resetForm()
    setIsModalOpen(false)
  }

  const handleEdit = (id: number) => {
    const card = cards.find((item) => item.id === id)

    if (!card) return

    setEditingId(id)

    setFormData({
      cardHolder: card.cardHolder,
      cardNumber: card.cardNumber,
      expiry: card.expiry,
      cardType: card.cardType,
      isDefault: card.isDefault,
    })

    setIsModalOpen(true)
  }

  const handleDelete = (id: number) => {
    setCards((prev) => prev.filter((item) => item.id !== id))
  }

  const handleSetDefault = (id: number) => {
    setCards((prev) =>
      prev.map((item) => ({
        ...item,
        isDefault: item.id === id,
      }))
    )
  }

  return (
    <div
      className="
    space-y-5 sm:space-y-8
    col-span-3
    px-2 sm:px-0
    "
    >
      {/* Header */}

      <div
        className="
      flex
      flex-col
      gap-4
      sm:flex-row
      sm:items-center
      sm:justify-between
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
            Payment Methods
          </h1>

          <p
            className="
          mt-1
          text-sm
          sm:text-base
          text-gray-500
          "
          >
            Manage your saved debit and credit cards.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm()
            setIsModalOpen(true)
          }}
          className="
          rounded-full
          bg-brand
          px-4
          py-2
          sm:px-6
          sm:py-3
          text-sm
          sm:text-base
          text-white
          transition
          hover:bg-brand-dark
          w-full
          sm:w-auto
          "
        >
          + Add New Card
        </button>
      </div>

      {/* Cards */}

      {cards.length > 0 ? (
        <div
          className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-4
        sm:gap-6
        "
        >
          {cards.map((card) => (
            <div
              key={card.id}
              className="
          rounded-2xl
          sm:rounded-3xl
          bg-gradient-to-br
          from-black
          via-gray-900
          to-gray-800
          p-4
          sm:p-7
          text-white
          shadow-xl
          "
            >
              {/* Top */}

              <div
                className="
          flex
          justify-between
          items-start
          gap-2
          "
              >
                <div>
                  <h3
                    className="
              text-base
              sm:text-xl
              font-bold
              "
                  >
                    {card.cardType}
                  </h3>

                  <p
                    className="
              text-xs
              sm:text-sm
              text-gray-300
              "
                  >
                    Credit / Debit Card
                  </p>
                </div>

                {card.isDefault && (
                  <span
                    className="
              rounded-full
              bg-green-500
              px-2
              sm:px-4
              py-1
              text-[10px]
              sm:text-xs
              font-semibold
              "
                  >
                    Default
                  </span>
                )}
              </div>

              {/* Card Number */}

              <div
                className="
          mt-8
          sm:mt-12
          text-lg
          sm:text-2xl
          font-semibold
          tracking-[3px]
          sm:tracking-[5px]
          "
              >
                {maskCardNumber(card.cardNumber)}
              </div>

              {/* Bottom */}

              <div
                className="
          mt-7
          sm:mt-10
          flex
          justify-between
          "
              >
                <div>
                  <p
                    className="
              text-[10px]
              sm:text-xs
              uppercase
              text-gray-400
              "
                  >
                    Card Holder
                  </p>

                  <p
                    className="
              mt-1
              text-sm
              sm:text-base
              font-medium
              "
                  >
                    {card.cardHolder}
                  </p>
                </div>

                <div>
                  <p
                    className="
              text-[10px]
              sm:text-xs
              uppercase
              text-gray-400
              "
                  >
                    Expiry
                  </p>

                  <p
                    className="
              mt-1
              text-sm
              sm:text-base
              font-medium
              "
                  >
                    {card.expiry}
                  </p>
                </div>
              </div>

              {/* Buttons */}

              <div
                className="
          mt-6
          sm:mt-8
          flex
          flex-wrap
          gap-2
          sm:gap-3
          "
              >
                <button
                  onClick={() => handleEdit(card.id)}
                  className="
          rounded-full
          bg-white
          px-4
          sm:px-5
          py-1.5
          sm:py-2
          text-xs
          sm:text-sm
          font-medium
          text-black
          "
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(card.id)}
                  className="
          rounded-full
          border
          border-red-400
          px-4
          sm:px-5
          py-1.5
          sm:py-2
          text-xs
          sm:text-sm
          text-red-400
          "
                >
                  Delete
                </button>

                {!card.isDefault && (
                  <button
                    onClick={() => handleSetDefault(card.id)}
                    className="
            rounded-full
            border
            border-white
            px-4
            sm:px-5
            py-1.5
            sm:py-2
            text-xs
            sm:text-sm
            "
                  >
                    Set Default
                  </button>
                )}
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
        p-8
        sm:p-14
        text-center
        "
        >
          <div
            className="
          text-4xl
          sm:text-6xl
          "
          >
            💳
          </div>

          <h2
            className="
          mt-4
          text-xl
          sm:text-2xl
          font-bold
          "
          >
            No Payment Methods
          </h2>
        </div>
      )}
      {/* Accepted Payment Methods */}

      <div
        className="
      rounded-2xl
      sm:rounded-3xl
      border
      p-4
      sm:p-7
      "
      >
        <h2
          className="
        text-lg
        sm:text-2xl
        font-bold
        "
        >
          Accepted Payment Methods
        </h2>

        <div
          className="
        mt-4
        sm:mt-6
        flex
        flex-wrap
        gap-2
        sm:gap-3
        "
        >
          {[
            '💳 Visa',
            '💳 MasterCard',
            '💳 American Express',
            '💳 PayPal',
            '💳 Apple Pay',
            '💳 Google Pay',
          ].map((method) => (
            <span
              key={method}
              className="
              rounded-full
              bg-lavender-100
              px-3
              sm:px-5
              py-1.5
              sm:py-2
              text-xs
              sm:text-sm
              "
            >
              {method}
            </span>
          ))}
        </div>
      </div>

      {/* Modal */}

      {isModalOpen && (
        <div
          className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-brand/50
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
            {/* Modal Header */}

            <div
              className="
          flex
          items-center
          justify-between
          border-b
          px-4
          sm:px-8
          py-4
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
                  {editingId ? 'Edit Card' : 'Add New Card'}
                </h2>

                <p
                  className="
              text-xs
              sm:text-sm
              text-gray-500
              "
                >
                  Enter your card information below.
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
              {/* Card Holder */}

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
                  Card Holder
                </label>

                <input
                  type="text"
                  name="cardHolder"
                  value={formData.cardHolder}
                  onChange={handleChange}
                  placeholder="Muhammad Sohaib"
                  className={`
            w-full
            rounded-xl
            border
            px-3
            sm:px-4
            py-2
            sm:py-3
            text-sm
            sm:text-base
            outline-none

            ${
              errors.cardHolder ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-brand'
            }

            `}
                />

                {errors.cardHolder && (
                  <p
                    className="
              mt-1
              text-xs
              sm:text-sm
              text-red-500
              "
                  >
                    {errors.cardHolder}
                  </p>
                )}
              </div>

              {/* Card Number */}

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
                  Card Number
                </label>

                <input
                  type="text"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleChange}
                  placeholder="4242424242424242"
                  className={`
            w-full
            rounded-xl
            border
            px-3
            sm:px-4
            py-2
            sm:py-3
            text-sm
            sm:text-base
            outline-none

            ${
              errors.cardNumber ? 'border-red-500' : 'border-gray-300 focus:ring-2 focus:ring-brand'
            }

            `}
                />

                {errors.cardNumber && (
                  <p
                    className="
              mt-1
              text-xs
              sm:text-sm
              text-red-500
              "
                  >
                    {errors.cardNumber}
                  </p>
                )}
              </div>

              {/* Expiry + Type */}

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
                    Expiry
                  </label>

                  <input
                    type="text"
                    name="expiry"
                    value={formData.expiry}
                    onChange={handleChange}
                    placeholder="MM/YY"
                    className="
              w-full
              rounded-xl
              border
              border-gray-300
              px-3
              sm:px-4
              py-2
              sm:py-3
              text-sm
              sm:text-base
              outline-none
              focus:ring-2
              focus:ring-brand
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
                    Card Type
                  </label>

                  <select
                    name="cardType"
                    value={formData.cardType}
                    onChange={handleChange}
                    className="
              w-full
              rounded-xl
              border
              border-gray-300
              px-3
              sm:px-4
              py-2
              sm:py-3
              text-sm
              sm:text-base
              outline-none
              focus:ring-2
              focus:ring-brand
              "
                  >
                    <option value="Visa">Visa</option>

                    <option value="MasterCard">MasterCard</option>
                  </select>
                </div>
              </div>

              {/* Default */}

              <label
                className="
          flex
          items-center
          gap-2
          sm:gap-3
          text-sm
          sm:text-base
          "
              >
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="
            h-4
            w-4
            sm:h-5
            sm:w-5
            "
                />

                <span>Make this my default payment method</span>
              </label>
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
          py-4
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
            sm:py-3
            text-sm
            sm:text-base
            hover:bg-lavender-100
            "
              >
                Cancel
              </button>

              <button
                onClick={handleSaveCard}
                className="
            rounded-xl
            bg-brand
            px-6
            sm:px-8
            py-2
            sm:py-3
            text-sm
            sm:text-base
            text-white
            hover:bg-brand-dark
            "
              >
                {editingId ? 'Update Card' : 'Save Card'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
