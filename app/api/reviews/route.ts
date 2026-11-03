import { getCurrentUser } from '@/lib/auth/session'
import { addReview, getReviewsForProduct } from '@/lib/catalog/reviews'
import { getDb } from '@/lib/db/client'
import { getClientIp, jsonError, jsonOk, readJson } from '@/lib/http'
import { rateLimit } from '@/lib/rate-limit'
import { reviewSchema } from '@/lib/validation'

export async function GET(request: Request) {
  const productId = Number(new URL(request.url).searchParams.get('productId'))
  if (!Number.isInteger(productId) || productId <= 0) return jsonError('productId is required.', 400)
  return jsonOk({ reviews: await getReviewsForProduct(productId) })
}

export async function POST(request: Request) {
  const limited = rateLimit(`review:${getClientIp(request)}`, 6, 60_000)
  if (!limited.success) return jsonError('Too many reviews. Please wait a moment.', 429, 'RATE_LIMITED')

  const parsed = reviewSchema.safeParse(await readJson(request))
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message || 'Please complete the review.', 400, 'VALIDATION')
  }

  const db = await getDb()
  const exists = await db.execute({ sql: 'SELECT 1 FROM products WHERE id = ?', args: [parsed.data.productId] })
  if (!exists.rows.length) return jsonError('Product not found.', 404, 'NOT_FOUND')

  const user = await getCurrentUser()
  await addReview({ ...parsed.data, userId: user?.id ?? null })
  return jsonOk({ reviews: await getReviewsForProduct(parsed.data.productId) }, 201)
}
