import 'server-only'

import type { InValue } from '@libsql/client'
import { getDb } from '@/lib/db/client'
import type { Product, ProductQuery } from '@/types/product'
import { CATALOG_FACETS } from './facets'

const SORTS: Record<NonNullable<ProductQuery['sort']>, string> = {
  featured: 'p.is_featured DESC, p.rating DESC, p.id ASC',
  'price-asc': 'p.price ASC, p.id ASC',
  'price-desc': 'p.price DESC, p.id ASC',
  rating: 'p.rating DESC, p.review_count DESC, p.id ASC',
  newest: 'p.arrival_date DESC, p.id DESC',
}

type Row = Record<string, unknown>

function placeholders(count: number) {
  return Array.from({ length: count }, () => '?').join(',')
}

function group(rows: Row[], key: string) {
  const map = new Map<number, string[]>()
  for (const row of rows) {
    const id = Number(row.product_id)
    const list = map.get(id) || []
    list.push(String(row[key]))
    map.set(id, list)
  }
  return map
}

async function hydrate(rows: Row[]): Promise<Product[]> {
  if (!rows.length) return []
  const db = await getDb()
  const ids = rows.map((row) => Number(row.id))
  const marks = placeholders(ids.length)

  const [images, colors, sizes, features] = await Promise.all([
    db.execute({ sql: `SELECT product_id, url AS value FROM product_images WHERE product_id IN (${marks}) ORDER BY position`, args: ids }),
    db.execute({ sql: `SELECT product_id, color AS value FROM product_colors WHERE product_id IN (${marks})`, args: ids }),
    db.execute({ sql: `SELECT product_id, size AS value FROM product_sizes WHERE product_id IN (${marks})`, args: ids }),
    db.execute({ sql: `SELECT product_id, feature AS value FROM product_features WHERE product_id IN (${marks}) ORDER BY position`, args: ids }),
  ])

  const imageMap = group(images.rows as unknown as Row[], 'value')
  const colorMap = group(colors.rows as unknown as Row[], 'value')
  const sizeMap = group(sizes.rows as unknown as Row[], 'value')
  const featureMap = group(features.rows as unknown as Row[], 'value')

  return rows.map((row) => {
    const id = Number(row.id)
    const gallery = imageMap.get(id) || []
    return {
      id,
      title: String(row.title),
      slug: String(row.slug),
      category: String(row.category),
      type: String(row.type),
      brand: String(row.brand),
      price: Number(row.price),
      oldPrice: row.old_price == null ? null : Number(row.old_price),
      discount: Number(row.discount),
      currency: '$',
      rating: Number(row.rating),
      reviews: Number(row.review_count),
      stock: Number(row.stock),
      sku: String(row.sku),
      arrivalDate: String(row.arrival_date),
      image: gallery[0] || '',
      gallery,
      colors: colorMap.get(id) || [],
      sizes: [...(sizeMap.get(id) || [])].sort(
        (a, b) => CATALOG_FACETS.sizes.indexOf(a) - CATALOG_FACETS.sizes.indexOf(b)
      ),
      style: String(row.style),
      description: String(row.description),
      features: featureMap.get(id) || [],
      isNew: Boolean(row.is_new),
      isFeatured: Boolean(row.is_featured),
      isBestseller: Boolean(row.is_bestseller),
    }
  })
}

async function selectProducts(where = '', args: InValue[] = [], order = SORTS.featured, tail = '') {
  const db = await getDb()
  const result = await db.execute({
    sql: `SELECT p.* FROM products p ${where} ORDER BY ${order} ${tail}`,
    args,
  })
  return hydrate(result.rows as unknown as Row[])
}

export async function getCatalog() {
  return selectProducts()
}

export async function getProductBySlug(slug: string) {
  const [product] = await selectProducts('WHERE p.slug = ?', [slug])
  return product || null
}

export async function getProductsByIds(ids: number[]) {
  if (!ids.length) return []
  return selectProducts(`WHERE p.id IN (${placeholders(ids.length)})`, ids)
}

export async function getRelatedProducts(product: Product, limit = 8) {
  return selectProducts(
    'WHERE p.slug != ? AND (p.type = ? OR p.category = ?)',
    [product.slug, product.type, product.category, product.type, product.category],
    '(p.type = ?) DESC, (p.category = ?) DESC, p.rating DESC, p.review_count DESC, p.id ASC',
    `LIMIT ${Math.min(24, Math.max(1, limit))}`
  )
}

export async function searchCatalog(query: ProductQuery) {
  const db = await getDb()
  const clauses: string[] = []
  const args: InValue[] = []

  if (query.sale) clauses.push('p.discount > 0')
  if (query.arrival) clauses.push('p.is_new = 1')
  if (query.style) {
    clauses.push('p.style = ?')
    args.push(query.style)
  }
  if (query.category) {
    clauses.push('p.category = ?')
    args.push(query.category)
  }
  if (query.type) {
    clauses.push('p.type = ?')
    args.push(query.type)
  }
  if (typeof query.minPrice === 'number' && !Number.isNaN(query.minPrice)) {
    clauses.push('p.price >= ?')
    args.push(query.minPrice)
  }
  if (typeof query.maxPrice === 'number' && !Number.isNaN(query.maxPrice)) {
    clauses.push('p.price <= ?')
    args.push(query.maxPrice)
  }
  if (query.color) {
    clauses.push('EXISTS (SELECT 1 FROM product_colors c WHERE c.product_id = p.id AND c.color = ?)')
    args.push(query.color)
  }
  if (query.size) {
    clauses.push('EXISTS (SELECT 1 FROM product_sizes s WHERE s.product_id = p.id AND s.size = ?)')
    args.push(query.size)
  }

  const keywords = (query.search || '').toLowerCase().split(/\s+/).filter(Boolean).slice(0, 6)
  for (const word of keywords) {
    const like = `%${word.replace(/[%_]/g, '')}%`
    clauses.push(`(
      lower(p.title || ' ' || p.brand || ' ' || p.category || ' ' || p.type || ' ' || p.style || ' ' || p.sku || ' ' || p.description) LIKE ?
      OR EXISTS (SELECT 1 FROM product_colors c WHERE c.product_id = p.id AND lower(c.color) LIKE ?)
      OR EXISTS (SELECT 1 FROM product_features f WHERE f.product_id = p.id AND lower(f.feature) LIKE ?)
    )`)
    args.push(like, like, like)
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
  const page = Math.max(1, Math.floor(query.page || 1))
  const limit = Math.min(48, Math.max(1, Math.floor(query.limit || 18)))

  const count = await db.execute({ sql: `SELECT COUNT(*) AS n FROM products p ${where}`, args })
  const total = Number(count.rows[0].n)
  const items = await selectProducts(
    where,
    args,
    SORTS[query.sort || 'featured'] || SORTS.featured,
    `LIMIT ${limit} OFFSET ${(page - 1) * limit}`
  )

  return {
    items,
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / limit)),
    facets: await getFacets(),
  }
}

async function distinct(sql: string) {
  const db = await getDb()
  const result = await db.execute(sql)
  return result.rows.map((row) => String(row[0]))
}

export async function getFacets() {
  const [categories, types, styles, colors, sizes] = await Promise.all([
    distinct('SELECT name FROM categories ORDER BY position'),
    distinct('SELECT DISTINCT type FROM products ORDER BY type'),
    distinct('SELECT DISTINCT style FROM products ORDER BY style'),
    distinct('SELECT DISTINCT color FROM product_colors ORDER BY color'),
    distinct('SELECT DISTINCT size FROM product_sizes ORDER BY size'),
  ])
  return { categories, types, styles, colors, sizes }
}

export async function getHomeCollections() {
  const [newArrivals, topSelling, bestSellers, featured] = await Promise.all([
    selectProducts('', [], SORTS.newest, 'LIMIT 8'),
    selectProducts('', [], 'p.review_count DESC, p.rating DESC, p.id ASC', 'LIMIT 8'),
    selectProducts(
      'WHERE p.is_bestseller = 1 AND p.stock > 0',
      [],
      'p.is_featured DESC, p.review_count DESC, p.id ASC',
      'LIMIT 8'
    ),
    selectProducts('WHERE p.is_featured = 1', [], SORTS.rating, 'LIMIT 8'),
  ])
  return { newArrivals, topSelling, bestSellers, featured }
}

export async function getCategorySummary() {
  const db = await getDb()
  const result = await db.execute(
    `SELECT c.name, c.label, COUNT(p.id) AS count
     FROM categories c LEFT JOIN products p ON p.category = c.name
     GROUP BY c.name ORDER BY c.position`
  )
  return result.rows.map((row) => ({
    name: String(row.name),
    label: String(row.label),
    count: Number(row.count),
  }))
}

export async function getCatalogSummary() {
  const db = await getDb()
  const [count, facets] = await Promise.all([db.execute('SELECT COUNT(*) AS n FROM products'), getFacets()])
  return {
    count: Number(count.rows[0].n),
    styles: facets.styles,
    categories: facets.categories,
    types: facets.types,
  }
}

export async function getStoreStats() {
  const db = await getDb()
  const [products, customers, orders, reviews] = await Promise.all([
    db.execute('SELECT COUNT(*) AS n FROM products'),
    db.execute('SELECT COUNT(*) AS n FROM users'),
    db.execute('SELECT COUNT(*) AS n FROM orders'),
    db.execute('SELECT COUNT(*) AS n FROM reviews'),
  ])
  return {
    products: Number(products.rows[0].n),
    customers: Number(customers.rows[0].n),
    orders: Number(orders.rows[0].n),
    reviews: Number(reviews.rows[0].n),
  }
}

export function toCard(product: Product) {
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    price: product.price,
    oldPrice: product.oldPrice,
    image: product.image,
    rating: product.rating,
    reviews: product.reviews,
    discount: product.discount,
    sizes: product.sizes,
    colors: product.colors,
    stock: product.stock,
    category: product.category,
  }
}
