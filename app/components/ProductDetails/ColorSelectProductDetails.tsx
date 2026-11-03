'use client'

import React, { useState } from 'react'

type ProductSpecifications = {
  size: string
  color: string
}

type PropsColorSelector = {
  colors: string[]
  setProductSpecifications: React.Dispatch<React.SetStateAction<ProductSpecifications>>
}

export const ColorSelectProductDetails = ({
  colors,
  setProductSpecifications,
}: PropsColorSelector) => {
  const [selectedColor, setSelectedColor] = useState(colors[0] ?? '')

  const colorMap: Record<string, string> = {
    Black: 'bg-black',

    Gray: 'bg-gray-500',

    Green: 'bg-green-600',

    White: 'bg-white border border-gray-300',

    Red: 'bg-red-600',

    Blue: 'bg-blue-600',

    Yellow: 'bg-yellow-400',

    Orange: 'bg-orange-500',

    Pink: 'bg-pink-500',

    Navy: 'bg-blue-900',

    Burgundy: 'bg-rose-900',

    Tan: 'bg-amber-600',

    Pastel: 'bg-gradient-to-br from-pink-200 via-violet-200 to-sky-200',
  }

  const handleColorSelect = (color: string) => {
    setSelectedColor(color)

    setProductSpecifications((prev) => ({
      ...prev,
      color,
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
        Select Color
      </h3>

      <div
        className="
        flex
        flex-wrap
        gap-2
        sm:gap-3
      "
      >
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => handleColorSelect(color)}
            className={`
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                cursor-pointer
                transition-all
                duration-200

                sm:h-10
                sm:w-10

                ${colorMap[color] ?? 'bg-gray-300'}


                ${
                  selectedColor === color
                    ? 'ring-2 ring-brand ring-offset-2 scale-110'
                    : 'hover:scale-105'
                }

              `}
          >
            {selectedColor === color && (
              <span
                className={`
                    text-xs
                    sm:text-sm

                    ${color === 'White' ? 'text-black' : 'text-white'}

                  `}
              >
                ✓
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
