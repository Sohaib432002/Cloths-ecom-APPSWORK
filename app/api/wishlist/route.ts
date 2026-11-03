import { getCurrentUser } from '@/lib/auth/session'
import { getDb } from '@/lib/db/client'
import { getProductsByIds, toCard } from '@/lib/catalog'
import { jsonError, jsonOk, readJson } from '@/lib/http'
import { wishlistSchema } from '@/lib/validation'

async function readWishlist(userId: string) {
  const db = await getDb()
  const result = await db.execute({
    sql: 'SELECT product_id FROM wishlist_items WHERE user_id = ? ORDER BY created_at',
    args: [userId],
  })
  const productIds = result.rows.map((row) => Number(row.product_id))
  const products = await getProductsByIds(productIds)
  const byId = new Map(products.map((product) => [product.id, toCard(product)]))
  return { productIds, products: productIds.flatMap((id) => (byId.has(id) ? [byId.get(id)!] : [])) }
}

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return jsonError('Please sign in to continue.', 401, 'UNAUTHENTICATED')
  return jsonOk(await readWishlist(user.id))
}

// Replaces the signed-in shopper's saved items with the given list.
export async function PUT(request: Request) {
  const user = await getCurrentUser()
  if (!user) return jsonError('Please sign in to continue.', 401, 'UNAUTHENTICATED')

  const parsed = wishlistSchema.safeParse(await readJson(request))
  if (!parsed.success) return jsonError('Invalid wishlist.', 400)

  const db = await getDb()
  const now = new Date().toISOString()
  const ids = [...new Set(parsed.data.productIds)]
  await db.batch(
    [
      { sql: 'DELETE FROM wishlist_items WHERE user_id = ?', args: [user.id] },
      ...ids.map((id) => ({
        sql: 'INSERT INTO wishlist_items (user_id, product_id, created_at) SELECT ?, id, ? FROM products WHERE id = ?',
        args: [user.id, now, id],
      })),
    ],
    'write'
  )
  return jsonOk(await readWishlist(user.id))
}
