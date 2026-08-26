'use client'

import React, { useState } from 'react'
import { StarRating } from '../common/StarRating'

export type Review = {
  id: number
  name: string
  rating: number
  verified: boolean
  date: string
  comment: string
}

type PropsProductReviews = {
  productReviews: Record<string, Review[]>
  slug: string
}

export const AboutProductDetails = ({ productReviews, slug }: PropsProductReviews) => {
  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'faq'>('reviews')

  const [openReviewModal, setOpenReviewModal] = useState(false)

  const productReviewsFilter = productReviews[slug] || []

  return (
    <div
      className="
w-full
mt-8
px-3
sm:px-5
md:px-8
"
    >
      {/* Tabs */}

      <div
        className="flex gap-5
sm:gap-8
overflow-x-auto
border-b
pb-1
scrollbar-hide
"
      >
        <button
          onClick={() => setActiveTab('details')}
          className={`
whitespace-nowrap
pb-3
text-sm
sm:text-base
transition

${activeTab === 'details' ? 'border-b-2 border-black text-black' : 'text-gray-400'}

`}
        >
          Product Details
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          className={`
whitespace-nowrap
pb-3
text-sm
sm:text-base

${activeTab === 'reviews' ? 'border-b-2 border-black text-black' : 'text-gray-400'}

`}
        >
          Rating & Reviews
        </button>

        <button
          onClick={() => setActiveTab('faq')}
          className={`
whitespace-nowrap
pb-3
text-sm
sm:text-base

${activeTab === 'faq' ? 'border-b-2 border-black text-black' : 'text-gray-400'}

`}
        >
          FAQs
        </button>
      </div>

      {/* Product Details */}

      {activeTab === 'details' && (
        <div
          className="
mt-5
rounded-2xl
border
p-4
sm:p-6
md:p-8
"
        >
          <h2
            className="
text-xl
sm:text-2xl
font-bold
mb-5
"
          >
            Product Details
          </h2>

          <div
            className="
space-y-5
text-sm
sm:text-base
text-gray-600
"
          >
            <div>
              <h3
                className="
font-semibold
text-black
mb-2
"
              >
                Description
              </h3>

              <p>
                Premium quality fabric designed for comfort and durability. Perfect for casual and
                daily wear.
              </p>
            </div>

            <div>
              <h3
                className="
font-semibold
text-black
mb-2
"
              >
                Features
              </h3>

              <ul
                className="
list-disc
ml-5
space-y-2
"
              >
                <li>Premium breathable fabric</li>
                <li>Soft material</li>
                <li>Comfort fit</li>
                <li>Machine washable</li>
              </ul>
            </div>

            <div
              className="
grid
grid-cols-1
md:grid-cols-2
gap-6
"
            >
              <div>
                <h3 className="font-semibold text-black">Specifications</h3>

                <p>Brand: SHOP.CO</p>
                <p>Material: Cotton Blend</p>
                <p>Fit: Regular</p>
              </div>

              <div>
                <h3 className="font-semibold text-black">Care</h3>

                <p>Machine wash cold</p>
                <p>Do not bleach</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reviews */}

      {activeTab === 'reviews' && (
        <div
          className="
mt-6
"
        >
          <div
            className="
flex
flex-col
sm:flex-row
sm:items-center
justify-between
gap-4
"
          >
            <h2
              className="
text-lg
sm:text-xl
font-bold
"
            >
              All Reviews
              <span
                className="
text-gray-400
text-sm
ml-1
"
              >
                ({productReviewsFilter.length})
              </span>
            </h2>

            <button
              onClick={() => setOpenReviewModal(true)}
              className="
bg-black
text-white
px-5
py-2.5
rounded-full
text-sm
sm:text-base
"
            >
              Write a Review
            </button>
          </div>

          <div
            className="
mt-6
grid
grid-cols-1
lg:grid-cols-2
gap-4
sm:gap-6
"
          >
            {productReviewsFilter.length > 0 ? (
              productReviewsFilter.map((item) => (
                <div
                  key={item.id}
                  className="
rounded-2xl
border
p-4
sm:p-6
"
                >
                  <StarRating rating={item.rating} />

                  <h3
                    className="
mt-3
font-bold
flex
gap-2
"
                  >
                    {item.name}

                    <span className="text-green-500">✔</span>
                  </h3>

                  <p
                    className="
mt-3
text-sm
sm:text-base
text-gray-500
"
                  >
                    {item.comment}
                  </p>

                  <p
                    className="
mt-4
text-xs
text-gray-400
"
                  >
                    Posted on {item.date}
                  </p>
                </div>
              ))
            ) : (
              <p>No Reviews</p>
            )}
          </div>
        </div>
      )}

      {/* Modal */}

      {openReviewModal && (
        <div
          className="
fixed
inset-0
z-50
flex
items-center
justify-center
bg-black/50
px-4
"
        >
          <div
            className="
w-full
max-w-md
rounded-3xl
bg-white
p-5
sm:p-8
"
          >
            <div
              className="
flex
justify-between
items-center
"
            >
              <h2
                className="
text-xl
font-bold
"
              >
                Write Review
              </h2>

              <button onClick={() => setOpenReviewModal(false)} className="text-gray-500">
                ✕
              </button>
            </div>

            <input
              placeholder="Your name"
              className="
mt-5
w-full
rounded-xl
border
p-3
outline-none
"
            />

            <div
              className="
mt-4
"
            >
              <StarRating rating={5} />
            </div>

            <textarea
              placeholder="Your review"
              className="
mt-4
h-32
w-full
rounded-xl
border
p-3
outline-none
"
            />

            <button
              className="
mt-5
w-full
rounded-xl
bg-black
py-3
text-white
"
            >
              Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
