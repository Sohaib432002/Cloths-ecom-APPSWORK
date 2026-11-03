import { randomInt } from 'node:crypto'
import type { InStatement } from '@libsql/client'
import { z } from 'zod'
import { getDb } from '@/lib/db/client'

const imageUrl = z
  .string()
  .trim()
  .refine((value) => /^https:\/\/.+/.test(value) || /^\/api\/media\/[A-Za-z0-9-]+$/.test(value), 'Images must be https links or uploaded photos.')

const list = (max: number) => z.array(z.string().trim().min(1).max(40)).min(1, 'Add at least one.').max(max)

export const productSchema = z.object({
  title: z.string().trim().min(3, 'Enter a product name.').max(120),
  category: z.string().trim().min(1),
  type: z.string().trim().min(2).max(40),
  style: z.enum(['Casual', 'Formal', 'Party', 'Gym']),
  price: z.number().positive('Price must be above 0.').max(100000),
  oldPrice: z.number().positive().max(100000).nullable().optional(),
  stock: z.number().int().min(0).max(100000),
  description: z.string().trim().min(10, 'Write a short description.').max(2000),
  colors: list(12),
  sizes: list(12),
  features: z.array(z.string().trim().min(1).max(80)).max(10).default([]),
  images: z.array(imageUrl).min(1, 'Add at least one photo.').max(8),
  isNew: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  isBestseller: z.boolean().default(false),
})

export type ProductInput = z.infer<typeof productSchema>

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80) || 'product'

async function uniqueSlug(title: string, ignoreId?: number) {
  const db = await getDb()
  const base = slugify(title)
  for (let i = 0; i < 50; i += 1) {
    const candidate = i === 0 ? base : `${base}-${i + 1}`
    const found = await db.execute({ sql: 'SELECT id FROM products WHERE slug = ?', args: [candidate] })
    if (!found.rows.length || Number(found.rows[0].id) === ignoreId) return candidate
  }
  return `${base}-${Date.now()}`
}

function childStatements(id: number, input: ProductInput): InStatement[] {
  return [
    ...input.images.map((url, position) => ({
      sql: 'INSERT INTO product_images (product_id, position, url) VALUES (?, ?, ?)',
      args: [id, position, url],
    })),
    ...[...new Set(input.colors)].map((color) => ({
      sql: 'INSERT INTO product_colors (product_id, color) VALUES (?, ?)',
      args: [id, color],
    })),
    ...[...new Set(input.sizes)].map((size) => ({
      sql: 'INSERT INTO product_sizes (product_id, size) VALUES (?, ?)',
      args: [id, size],
    })),
    ...input.features.map((feature, position) => ({
      sql: 'INSERT INTO product_features (product_id, position, feature) VALUES (?, ?, ?)',
      args: [id, position, feature],
    })),
  ]
}

function discountOf(input: ProductInput) {
  return input.oldPrice && input.oldPrice > input.price ? Math.round((1 - input.price / input.oldPrice) * 100) : 0
}

export async function createProduct(input: ProductInput) {
  const db = await getDb()
  const slug = await uniqueSlug(input.title)
  const sku = `${input.category.slice(0, 3).toUpperCase()}-${Date.now().toString(36).toUpperCase()}${randomInt(10, 99)}`
  const inserted = await db.execute({
    sql: `INSERT INTO products (slug, sku, title, category, type, style, brand, description, price, old_price, discount,
            stock, arrival_date, is_new, is_featured, is_bestseller)
          VALUES (?, ?, ?, ?, ?, ?, 'Véora', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      slug, sku, input.title, input.category, input.type, input.style, input.description, input.price,
      input.oldPrice && input.oldPrice > input.price ? input.oldPrice : null, discountOf(input), input.stock,
      new Date().toISOString().slice(0, 10), input.isNew ? 1 : 0, input.isFeatured ? 1 : 0, input.isBestseller ? 1 : 0,
    ],
  })
  const id = Number(inserted.lastInsertRowid)
  await db.batch(childStatements(id, input), 'write')
  return { id, slug }
}

export async function updateProduct(id: number, input: ProductInput) {
  const db = await getDb()
  const existing = await db.execute({ sql: 'SELECT slug FROM products WHERE id = ?', args: [id] })
  if (!existing.rows.length) return false

  await db.batch(
    [
      {
        sql: `UPDATE products SET title = ?, category = ?, type = ?, style = ?, description = ?, price = ?, old_price = ?,
                discount = ?, stock = ?, is_new = ?, is_featured = ?, is_bestseller = ? WHERE id = ?`,
        args: [
          input.title, input.category, input.type, input.style, input.description, input.price,
          input.oldPrice && input.oldPrice > input.price ? input.oldPrice : null, discountOf(input), input.stock,
          input.isNew ? 1 : 0, input.isFeatured ? 1 : 0, input.isBestseller ? 1 : 0, id,
        ],
      },
      { sql: 'DELETE FROM product_images WHERE product_id = ?', args: [id] },
      { sql: 'DELETE FROM product_colors WHERE product_id = ?', args: [id] },
      { sql: 'DELETE FROM product_sizes WHERE product_id = ?', args: [id] },
      { sql: 'DELETE FROM product_features WHERE product_id = ?', args: [id] },
      ...childStatements(id, input),
    ],
    'write'
  )
  return true
}

/** Products that were ever ordered are hidden instead of deleted so order history stays intact. */
export async function removeProduct(id: number) {
  const db = await getDb()
  const ordered = await db.execute({ sql: 'SELECT 1 FROM order_items WHERE product_id = ? LIMIT 1', args: [id] })
  if (ordered.rows.length) {
    await db.execute({ sql: 'UPDATE products SET is_active = 0 WHERE id = ?', args: [id] })
    return 'hidden' as const
  }
  await db.execute({ sql: 'DELETE FROM products WHERE id = ?', args: [id] })
  return 'deleted' as const
}

export async function setProductActive(id: number, active: boolean) {
  const db = await getDb()
  const result = await db.execute({ sql: 'UPDATE products SET is_active = ? WHERE id = ?', args: [active ? 1 : 0, id] })
  return result.rowsAffected > 0
}

export async function listProductsAdmin(query: string, page = 1, pageSize = 20) {
  const db = await getDb()
  const like = `%${query.trim().toLowerCase().replace(/[%_]/g, '')}%`
  const where = query.trim() ? 'WHERE lower(p.title || \' \' || p.sku || \' \' || p.category) LIKE ?' : ''
  const args = query.trim() ? [like] : []
  const total = await db.execute({ sql: `SELECT COUNT(*) AS n FROM products p ${where}`, args })
  const rows = await db.execute({
    sql: `SELECT p.id, p.title, p.sku, p.category, p.price, p.stock, p.is_active,
            (SELECT url FROM product_images WHERE product_id = p.id ORDER BY position LIMIT 1) AS image
          FROM products p ${where} ORDER BY p.id DESC LIMIT ? OFFSET ?`,
    args: [...args, pageSize, (Math.max(1, page) - 1) * pageSize],
  })
  return {
    total: Number(total.rows[0].n),
    items: rows.rows.map((row) => ({
      id: Number(row.id),
      title: String(row.title),
      sku: String(row.sku),
      category: String(row.category),
      price: Number(row.price),
      stock: Number(row.stock),
      active: Boolean(row.is_active),
      image: row.image ? String(row.image) : '',
    })),
  }
}

export async function getProductAdmin(id: number) {
  const db = await getDb()
  const row = await db.execute({ sql: 'SELECT * FROM products WHERE id = ?', args: [id] })
  if (!row.rows.length) return null
  const p = row.rows[0]
  const [images, colors, sizes, features] = await Promise.all([
    db.execute({ sql: 'SELECT url FROM product_images WHERE product_id = ? ORDER BY position', args: [id] }),
    db.execute({ sql: 'SELECT color FROM product_colors WHERE product_id = ?', args: [id] }),
    db.execute({ sql: 'SELECT size FROM product_sizes WHERE product_id = ?', args: [id] }),
    db.execute({ sql: 'SELECT feature FROM product_features WHERE product_id = ? ORDER BY position', args: [id] }),
  ])
  return {
    id,
    title: String(p.title),
    category: String(p.category),
    type: String(p.type),
    style: String(p.style),
    price: Number(p.price),
    oldPrice: p.old_price == null ? null : Number(p.old_price),
    stock: Number(p.stock),
    description: String(p.description),
    colors: colors.rows.map((r) => String(r.color)),
    sizes: sizes.rows.map((r) => String(r.size)),
    features: features.rows.map((r) => String(r.feature)),
    images: images.rows.map((r) => String(r.url)),
    isNew: Boolean(p.is_new),
    isFeatured: Boolean(p.is_featured),
    isBestseller: Boolean(p.is_bestseller),
  }
}
