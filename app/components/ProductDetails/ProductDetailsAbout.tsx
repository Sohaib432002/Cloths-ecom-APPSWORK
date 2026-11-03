'use client'

import React, { useState } from 'react'
import { StarRating } from '../common/StarRating'
import { apiFetch } from '@/lib/client/api'
import { useAuth } from '@/context/AuthContext'

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
  productId: number
}

export const AboutProductDetails = ({ productReviews, slug, productId }: PropsProductReviews) => {
  const { user } = useAuth()
  const [reviewList, setReviewList] = useState<Review[]>(productReviews[slug] || [])
  const [form, setForm] = useState({ name: '', rating: 5, comment: '' })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const [activeTab, setActiveTab] = useState<'details' | 'reviews' | 'faq'>('reviews')

  const [openReviewModal, setOpenReviewModal] = useState(false)

  const productReviewsFilter = reviewList

  const submitReview = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setFormError('')
    try {
      const data = await apiFetch<{ reviews: Review[] }>('/api/reviews', {
        method: 'POST',
        body: JSON.stringify({ productId, name: form.name || user?.name || '', rating: form.rating, comment: form.comment }),
      })
      setReviewList(data.reviews)
      setForm({ name: '', rating: 5, comment: '' })
      setOpenReviewModal(false)
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to post your review.')
    } finally {
      setSubmitting(false)
    }
  }

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

${activeTab === 'details' ? 'border-b-2 border-brand text-black' : 'text-gray-400'}

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

${activeTab === 'reviews' ? 'border-b-2 border-brand text-black' : 'text-gray-400'}

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

${activeTab === 'faq' ? 'border-b-2 border-brand text-black' : 'text-gray-400'}

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

                <p>Brand: Véora</p>
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
bg-brand
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
              <p className="text-gray-500">No reviews yet. Be the first to share your thoughts.</p>
            )}
          </div>
        </div>
      )}

      {/* Modal */}

      {openReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-indigo-deeper/60 px-4" onClick={() => setOpenReviewModal(false)}>
          <form
            onSubmit={submitReview}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white p-5 sm:p-8"
            aria-label="Write a review"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">Write a review</h2>
              <button type="button" aria-label="Close" onClick={() => setOpenReviewModal(false)} className="text-gray-500">
                ✕
              </button>
            </div>

            <label htmlFor="review-name" className="mt-5 block text-sm font-medium">
              Your name
            </label>
            <input
              id="review-name"
              value={form.name || user?.name || ''}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              className="mt-1 w-full rounded-xl border border-lavender-200 p-3 outline-none focus:border-brand"
              required
              minLength={2}
            />

            <fieldset className="mt-4">
              <legend className="text-sm font-medium">Rating</legend>
              <div className="mt-1 flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    aria-label={`${star} star${star > 1 ? 's' : ''}`}
                    aria-pressed={form.rating === star}
                    onClick={() => setForm({ ...form, rating: star })}
                    className={`text-3xl leading-none ${star <= form.rating ? 'text-amber-400' : 'text-lavender-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </fieldset>

            <label htmlFor="review-comment" className="mt-4 block text-sm font-medium">
              Your review
            </label>
            <textarea
              id="review-comment"
              value={form.comment}
              onChange={(event) => setForm({ ...form, comment: event.target.value })}
              className="mt-1 h-32 w-full rounded-xl border border-lavender-200 p-3 outline-none focus:border-brand"
              required
              minLength={10}
            />

            {formError && (
              <p role="alert" className="mt-3 text-sm text-red-600">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-5 w-full rounded-full bg-brand py-3 font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {submitting ? 'Posting...' : 'Submit review'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
