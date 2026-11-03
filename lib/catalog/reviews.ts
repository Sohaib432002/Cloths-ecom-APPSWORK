import 'server-only'

import { getDb } from '@/lib/db/client'
import type { ProductReview } from '@/types/product'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}

export async function getReviewsForProduct(productId: number, limit = 50): Promise<ProductReview[]> {
  const db = await getDb()
  const result = await db.execute({
    sql: `SELECT id, author_name, rating, comment, verified, created_at FROM reviews
          WHERE product_id = ? ORDER BY created_at DESC, id DESC LIMIT ?`,
    args: [productId, limit],
  })
  return result.rows.map((row) => ({
    id: Number(row.id),
    name: String(row.author_name),
    rating: Number(row.rating),
    verified: Boolean(row.verified),
    date: formatDate(String(row.created_at)),
    comment: String(row.comment),
  }))
}

export async function getTopReviews(limit = 6) {
  const db = await getDb()
  const result = await db.execute({
    sql: `SELECT r.id, r.author_name, r.rating, r.comment, r.verified, p.title, p.slug
          FROM reviews r JOIN products p ON p.id = r.product_id
          WHERE r.rating = 5 AND length(r.comment) BETWEEN 80 AND 240
          ORDER BY r.created_at DESC, r.id DESC LIMIT ?`,
    args: [limit],
  })
  return result.rows.map((row) => ({
    id: Number(row.id),
    name: String(row.author_name),
    rating: Number(row.rating),
    verified: Boolean(row.verified),
    review: String(row.comment),
    product: String(row.title),
    slug: String(row.slug),
  }))
}

export async function addReview(input: {
  productId: number
  userId: string | null
  name: string
  rating: number
  comment: string
}) {
  const db = await getDb()
  let verified = false
  if (input.userId) {
    const bought = await db.execute({
      sql: `SELECT COUNT(*) AS n FROM order_items i JOIN orders o ON o.id = i.order_id
            WHERE o.user_id = ? AND i.product_id = ?`,
      args: [input.userId, input.productId],
    })
    verified = Number(bought.rows[0].n) > 0
  }

  await db.batch(
    [
      {
        sql: `INSERT INTO reviews (product_id, user_id, author_name, rating, comment, verified, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [input.productId, input.userId, input.name, input.rating, input.comment, verified ? 1 : 0, new Date().toISOString()],
      },
      {
        // fold the new rating into the running average
        sql: `UPDATE products SET
                rating = round((rating * review_count + ?) / (review_count + 1), 1),
                review_count = review_count + 1
              WHERE id = ?`,
        args: [input.rating, input.productId],
      },
    ],
    'write'
  )
}
