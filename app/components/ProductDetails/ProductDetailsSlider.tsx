'use client'

import Image from 'next/image'
import { useState } from 'react'

type SliderProps = {
  Productslug: string
  image: string
  gallery: string[]
}

export const ProductDetailslider = ({ Productslug, image, gallery }: SliderProps) => {
  const [selectImg, setSelectImg] = useState(0)

  return (
    <div
      className="
        flex
        w-full
        flex-col
        gap-4
        lg:flex-row
        lg:gap-6
      "
    >
      {/* Thumbnail Images */}

      <div
        className="
          order-2
          flex
          gap-3
          overflow-x-auto

          lg:order-1
          lg:w-28
          lg:flex-col
          lg:overflow-visible
        "
      >
        {gallery.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setSelectImg(i)}
            className={`
              shrink-0
              rounded-xl
              bg-lavender-100
              p-2
              transition-all
              
              w-20
              h-20

              sm:w-24
              sm:h-24

              lg:w-24
              lg:h-24

              ${selectImg === i ? 'border-2 border-brand' : 'border-2 border-transparent'}
            `}
          >
            <Image
              src={img}
              width={120}
              height={120}
              alt={`${Productslug}-angle-${i + 1}`}
              className="
                h-full
                w-full
                object-contain
              "
            />
          </button>
        ))}
      </div>

      {/* Main Image */}

      <div
        className="
          order-1
          flex
          w-full
          items-center
          justify-center
          rounded-2xl
          bg-lavender-100
          p-4

          sm:p-6

          lg:order-2
          lg:flex-1
          lg:p-8
        "
      >
        <Image
          src={gallery[selectImg] || image}
          width={600}
          height={600}
          alt={Productslug}
          className="
            h-auto
            max-h-[350px]
            w-full
            object-contain

            sm:max-h-[450px]

            lg:max-h-[550px]
          "
        />
      </div>
    </div>
  )
}
