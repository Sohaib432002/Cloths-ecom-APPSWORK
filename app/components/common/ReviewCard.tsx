import Link from 'next/link'
import { BadgeCheck } from 'lucide-react'
import { StarRating } from './StarRating'

type Reviews = {
  name: string
  review: string
  rating?: number
  verified?: boolean
  product?: string
  slug?: string
}

const ReviewCard = ({ name, review, rating = 5, verified = false, product, slug }: Reviews) => {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-lavender-200/70 bg-white p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-14px_rgba(98,72,196,0.3)]">
      <StarRating rating={rating} size="sm" showValue={false} />
      <blockquote className="mt-3 flex-1 text-sm leading-7 text-gray-600">“{review}”</blockquote>
      <figcaption className="mt-4 border-t border-lavender-100 pt-3">
        <p className="flex items-center gap-1.5 text-sm font-semibold">
          {name}
          {verified && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-brand">
              <BadgeCheck size={14} /> Verified buyer
            </span>
          )}
        </p>
        {product && slug && (
          <Link href={`/ProductDetails/${slug}`} className="mt-0.5 block truncate text-xs text-gray-400 hover:text-brand">
            on {product}
          </Link>
        )}
      </figcaption>
    </figure>
  )
}

export default ReviewCard
