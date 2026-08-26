'use client'

import React, { useState } from 'react'

type ProductSpecifications = {
  size: string
  color: string
}

type PropsProductSizeChoser = {
  sizes: string[]
  setProductSpecifications: React.Dispatch<React.SetStateAction<ProductSpecifications>>
}

export const ProductDetailsSizeChoser = ({
  sizes,
  setProductSpecifications,
}: PropsProductSizeChoser) => {
  const [selectedSize, setSelectedSize] = useState(sizes[0] ?? '')

  const sizeMap: Record<string, string> = {
    S: 'Small',

    M: 'Medium',

    L: 'Large',

    XL: 'Extra Large',

    XXL: 'Extra Extra Large',
  }

  const handleSizeSelect = (size: string) => {
    setSelectedSize(size)

    setProductSpecifications((prev) => ({
      ...prev,
      size,
    }))
  }

  return (
    <div
      className="
      w-full
    "
    >
      <h3
        className="
        mb-3
        text-sm
        font-semibold
        sm:text-base
      "
      >
        Choose Size
      </h3>

      <div
        className="
        flex
        flex-wrap
        gap-2
        sm:gap-3
      "
      >
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => handleSizeSelect(size)}
            className={`
                h-9
                min-w-16
                rounded-full
                px-4
                text-sm
                font-medium
                transition-all
                duration-200

                sm:h-11
                sm:min-w-20
                sm:px-6
                sm:text-base


                ${
                  selectedSize === size
                    ? 'bg-black text-white scale-105'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }

              `}
          >
            {sizeMap[size] ?? size}
          </button>
        ))}
      </div>
    </div>
  )
}
