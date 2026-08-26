'use client'
import { useState } from 'react'
import { Range } from 'react-range'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
const MIN = 0
const MAX = 1000

export const PriceSlider = () => {
  const [values, setValues] = useState([0, 1000])
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const onChange = (newValues: number[]) => {
    setValues(newValues)

    const params = new URLSearchParams(searchParams.toString())

    params.set('minPrice', newValues[0].toString())
    params.set('maxPrice', newValues[1].toString())

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    })
  }

  return (
    <div className="w-full   mt-5 p-2 bg-white">
      <Range
        values={values}
        step={1}
        min={MIN}
        max={MAX}
        onChange={onChange}
        renderTrack={({ props, children }) => (
          <div
            {...props}
            className="h-2 w-full rounded-full bg-gray-200"
            style={{
              ...props.style,
              background: `linear-gradient(
        to right,
        #e5e7eb 0%,
        #e5e7eb ${(values[0] / MAX) * 100}%,
        #000 ${(values[0] / MAX) * 100}%,
        #000 ${(values[1] / MAX) * 100}%,
        #e5e7eb ${(values[1] / MAX) * 100}%,
        #e5e7eb 100%
      )`,
            }}
          >
            {children}
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            className="w-4 h-4 rounded-full bg-black border-2 border-black shadow-lg outline-none cursor-pointer"
          />
        )}
      />

      {/* Prices */}
      <div className="flex justify-between mt-5 text-[14px] font-medium">
        <span>${values[0]}</span>
        <span>${values[1]}</span>
      </div>
    </div>
  )
}
