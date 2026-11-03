'use client'

import { useRef } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import ReviewCard from '../common/ReviewCard'
import SectionHeading from './SectionHeading'

type HomeReview = {
  id: number
  name: string
  rating: number
  verified: boolean
  review: string
  product: string
  slug: string
}

const Reviews = ({ reviews }: { reviews: HomeReview[] }) => {
  const sliderRef = useRef<HTMLDivElement>(null)
  const scroll = (direction: 1 | -1) => sliderRef.current?.scrollBy({ left: direction * 360, behavior: 'smooth' })

  if (!reviews.length) return null

  const arrow =
    'flex h-10 w-10 items-center justify-center rounded-full border border-lavender-200 bg-white text-black transition hover:border-brand hover:bg-brand hover:text-white'

  return (
    <section className="mx-auto max-w-310">
      <div className="flex items-end justify-between gap-4">
        <div className="flex-1">
          <SectionHeading eyebrow="Customer love" title="What shoppers are saying" />
        </div>
        <div className="mb-8 flex gap-2">
          <button type="button" onClick={() => scroll(-1)} aria-label="Previous reviews" className={arrow}>
            <ArrowLeft size={16} />
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label="Next reviews" className={arrow}>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div ref={sliderRef} className="flex gap-4 overflow-x-auto scroll-smooth pb-2 scrollbar-hide">
        {reviews.map((review) => (
          <div key={review.id} className="w-[82%] shrink-0 sm:w-[340px]">
            <ReviewCard
              name={review.name}
              review={review.review}
              rating={review.rating}
              verified={review.verified}
              product={review.product}
              slug={review.slug}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default Reviews
