'use client'

import { useRef } from 'react'
import ReviewCard from '../common/ReviewCard'
import { CustommerReviews } from '../../lib/data/Reviews'

const Reviews = () => {
  const sliderRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    sliderRef.current?.scrollBy({
      left: -380,
      behavior: 'smooth',
    })
  }

  const scrollRight = () => {
    sliderRef.current?.scrollBy({
      left: 380,
      behavior: 'smooth',
    })
  }

  return (
    <section className="mx-auto max-w-310  py-12  lg:py-20">
      {/* Header */}

      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500 sm:text-sm">
            Testimonials
          </p>

          <h2 className="text-3xl font-black leading-tight sm:text-4xl lg:text-5xl">
            OUR HAPPY
            <br className="hidden sm:block" />
            CUSTOMERS
          </h2>
        </div>

        {/* Navigation */}

        <div className="hidden items-center gap-3 sm:flex">
          <button
            onClick={scrollLeft}
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              border-gray-200
              bg-white
              text-xl
              shadow-sm
              transition-all
              duration-300
              hover:-translate-x-1
              hover:bg-black
              hover:text-white
            "
          >
            ←
          </button>

          <button
            onClick={scrollRight}
            className="
              flex
              h-11
              w-11
              items-center
              justify-center
              rounded-full
              border
              border-gray-200
              bg-white
              text-xl
              shadow-sm
              transition-all
              duration-300
              hover:translate-x-1
              hover:bg-black
              hover:text-white
            "
          >
            →
          </button>
        </div>
      </div>

      {/* Reviews Slider */}

      <div className="relative">
        {/* Left Blur */}

        {/* <div className="pointer-events-none absolute left-0 top-0 z-10 hidden h-full w-24 bg-gradient-to-r from-white to-transparent lg:block" /> */}

        {/* Right Blur */}

        {/* <div className="pointer-events-none absolute right-0 top-0 z-10 hidden h-full w-24 bg-gradient-to-l from-white to-transparent lg:block" /> */}

        <div
          ref={sliderRef}
          className="
            flex
            gap-4
            overflow-x-auto
            scroll-smooth
            pb-4
            scrollbar-hide
            sm:gap-3
          "
        >
          {CustommerReviews.map((review) => (
            <div
              key={review.id}
              className="
                w-[80%]
                shrink-0
                sm:w-[400px]
                lg:w-[400px]
              "
            >
              <ReviewCard name={review.name} review={review.review} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Buttons */}

      <div className="mt-8 flex justify-center gap-4 sm:hidden">
        <button
          onClick={scrollLeft}
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            bg-black
            text-lg
            text-white
          "
        >
          ←
        </button>

        <button
          onClick={scrollRight}
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            bg-black
            text-lg
            text-white
          "
        >
          →
        </button>
      </div>
    </section>
  )
}

export default Reviews
