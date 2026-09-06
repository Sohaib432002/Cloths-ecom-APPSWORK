import type { ProductReview } from '@/types/product'

const NAMES = [
  'Ava Patel',
  'Noah Williams',
  'Mia Chen',
  'Liam Brooks',
  'Sofia Alvarez',
  'Ethan Reed',
  'Isla Thompson',
  'Owen Parker',
  'Aria Khan',
  'Lucas Bennett',
]

const COMMENTS = [
  'The fabric feels premium and the fit is true to size. I have already worn this twice this week.',
  'Excellent everyday piece. The stitching is clean and the color matches the photos.',
  'Comfortable from the first wear. I would buy another color without hesitation.',
  'Great quality for the price. It layers well and still looks sharp after washing.',
  'Exactly what I wanted for my wardrobe. Delivery was fast and the item was well packed.',
  'Soft, durable, and easy to style. This has become one of my most worn pieces.',
]

function hashString(value: string) {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

export function getReviewsForProduct(slug: string, count = 4): ProductReview[] {
  const seed = hashString(slug)
  return Array.from({ length: count }, (_, index) => {
    const rating = 4 + ((seed + index) % 2)
    const daysAgo = 8 + ((seed + index * 13) % 80)
    const date = new Date()
    date.setDate(date.getDate() - daysAgo)

    return {
      id: index + 1,
      name: NAMES[(seed + index) % NAMES.length],
      rating,
      verified: true,
      date: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      comment: COMMENTS[(seed + index * 3) % COMMENTS.length],
    }
  })
}
