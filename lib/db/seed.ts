import type { Client, InStatement } from '@libsql/client'
import { products as baseProducts } from '../../db/products.seed.js'
import { productReviews } from '../../db/reviews.seed.js'
import { resolveProductGallery, resolveProductImage } from '../catalog/images'
import { CATEGORY_LABELS } from '../catalog/facets'

type SeedProduct = {
  title: string
  slug: string
  category: string
  type: string
  style: string
  price: number
  oldPrice?: number
  stock: number
  colors: string[]
  sizes: string[]
  features: string[]
  description: string
  images: string[]
  bestseller?: boolean
}

const unsplash = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`
const SHOE_SIZES = ['7', '8', '9', '10', '11']

// Véora's own footwear and accessories line, added to the imported clothing catalog.
const VEORA_EDIT: SeedProduct[] = [
  {
    title: 'Court Classic Sneakers',
    slug: 'court-classic-sneakers',
    category: 'Footwear',
    type: 'Sneakers',
    style: 'Casual',
    price: 64.99,
    stock: 48,
    colors: ['White'],
    sizes: SHOE_SIZES,
    features: ['Leather-look upper', 'Cushioned insole', 'Rubber cupsole'],
    description: 'A clean white court sneaker that goes with everything, from denim to tailoring.',
    images: [unsplash('1608231387042-66d1773070a5')],
    bestseller: true,
  },
  {
    title: 'Lightweight Running Shoes',
    slug: 'lightweight-running-shoes',
    category: 'Footwear',
    type: 'Sneakers',
    style: 'Gym',
    price: 64.99,
    stock: 36,
    colors: ['White', 'Orange'],
    sizes: SHOE_SIZES,
    features: ['Breathable mesh', 'Responsive foam midsole', 'Grippy outsole'],
    description: 'Light, cushioned trainers built for daily runs and gym sessions.',
    images: [unsplash('1600185365926-3a2ce3cdb9eb')],
    bestseller: true,
  },
  {
    title: 'Low-Top Canvas Sneakers',
    slug: 'low-top-canvas-sneakers',
    category: 'Footwear',
    type: 'Sneakers',
    style: 'Casual',
    price: 54.99,
    stock: 52,
    colors: ['Burgundy'],
    sizes: SHOE_SIZES,
    features: ['Canvas upper', 'Vulcanised sole', 'Padded collar'],
    description: 'Easygoing canvas low-tops in a deep burgundy with a white vulcanised sole.',
    images: [unsplash('1525966222134-fcfa99b8ae77')],
  },
  {
    title: 'Pastel Layer Sneakers',
    slug: 'pastel-layer-sneakers',
    category: 'Footwear',
    type: 'Sneakers',
    style: 'Party',
    price: 89.99,
    oldPrice: 109.99,
    stock: 24,
    colors: ['Pastel'],
    sizes: SHOE_SIZES,
    features: ['Layered panels', 'Soft pastel palette', 'Platform sole'],
    description: 'Layered pastel panels on a chunky sole for a lighter take on the street sneaker.',
    images: [unsplash('1595950653106-6c9ebd614d3a')],
  },
  {
    title: 'Everyday Leather Sneakers',
    slug: 'everyday-leather-sneakers',
    category: 'Footwear',
    type: 'Sneakers',
    style: 'Formal',
    price: 94.99,
    stock: 30,
    colors: ['Tan'],
    sizes: SHOE_SIZES,
    features: ['Full-grain leather look', 'Stitched sole', 'Cushioned footbed'],
    description: 'A tan leather sneaker smart enough for the office and relaxed enough for weekends.',
    images: [unsplash('1549298916-b41d501d3772')],
  },
  {
    title: 'Street Black Trainers',
    slug: 'street-black-trainers',
    category: 'Footwear',
    type: 'Sneakers',
    style: 'Gym',
    price: 74.99,
    oldPrice: 89.99,
    stock: 41,
    colors: ['Black'],
    sizes: SHOE_SIZES,
    features: ['Low-profile cushioning', 'Lace-up fit', 'Textured sole'],
    description: 'Minimal black trainers with a low profile and all-day comfort.',
    images: [unsplash('1491553895911-0055eca6402d')],
  },
  {
    title: 'Classic Cap',
    slug: 'classic-cap',
    category: 'Accessories',
    type: 'Caps',
    style: 'Casual',
    price: 19.99,
    stock: 120,
    colors: ['Gray'],
    sizes: ['One Size'],
    features: ['Washed cotton', 'Adjustable strap', 'Curved brim'],
    description: 'A washed-cotton baseball cap with a relaxed, lived-in finish.',
    images: [unsplash('1521369909029-2afed882baee')],
    bestseller: true,
  },
  {
    title: 'White Trucker Cap',
    slug: 'white-trucker-cap',
    category: 'Accessories',
    type: 'Caps',
    style: 'Casual',
    price: 17.99,
    stock: 95,
    colors: ['White'],
    sizes: ['One Size'],
    features: ['Mesh back', 'Snap closure', 'Structured front'],
    description: 'Breathable mesh-back trucker in clean white.',
    images: [unsplash('1588850561407-ed78c282e89b')],
  },
  {
    title: 'Everyday Snapback',
    slug: 'everyday-snapback',
    category: 'Accessories',
    type: 'Caps',
    style: 'Casual',
    price: 21.99,
    stock: 80,
    colors: ['White'],
    sizes: ['One Size'],
    features: ['Flat brim', 'Snapback closure', 'Cotton twill'],
    description: 'A flat-brim snapback in soft cotton twill.',
    images: [unsplash('1622445275576-721325763afe')],
  },
  {
    title: 'Structured Top-Handle Bag',
    slug: 'structured-top-handle-bag',
    category: 'Accessories',
    type: 'Bags',
    style: 'Party',
    price: 89.99,
    oldPrice: 119.99,
    stock: 18,
    colors: ['Red'],
    sizes: ['One Size'],
    features: ['Structured shape', 'Metal clasp', 'Top handle'],
    description: 'A structured top-handle bag with a polished clasp, made to be noticed.',
    images: [unsplash('1584917865442-de89df76afd3')],
  },
  {
    title: 'Woven Tan Handbag',
    slug: 'woven-tan-handbag',
    category: 'Accessories',
    type: 'Bags',
    style: 'Casual',
    price: 99.99,
    stock: 14,
    colors: ['Tan'],
    sizes: ['One Size'],
    features: ['Woven panel', 'Leather trim', 'Turn-lock closure'],
    description: 'A woven handbag with leather trim and a turn-lock closure.',
    images: [unsplash('1590874103328-eac38a683ce7')],
  },
  {
    title: 'Navy Daily Backpack',
    slug: 'navy-daily-backpack',
    category: 'Accessories',
    type: 'Bags',
    style: 'Casual',
    price: 59.99,
    stock: 44,
    colors: ['Navy'],
    sizes: ['One Size'],
    features: ['Padded laptop sleeve', 'Water-resistant fabric', 'Front zip pocket'],
    description: 'A roomy water-resistant backpack with a padded laptop sleeve.',
    images: [unsplash('1553062407-98eeb64c6a62')],
  },
]

const COUPON_SEED = [
  { code: 'WELCOME20', label: '20% off your first order', description: 'New customers save 20% on orders over $40.', type: 'percent', value: 20, minSubtotal: 40 },
  { code: 'SHOP10', label: '10% off', description: 'Save 10% on any order.', type: 'percent', value: 10, minSubtotal: null },
  { code: 'STYLE25', label: '25% off orders over $200', description: 'Save 25% when your bag totals $200 or more.', type: 'percent', value: 25, minSubtotal: 200 },
  { code: 'FREESHIP', label: 'Free standard shipping', description: 'Complimentary standard delivery on this order.', type: 'shipping', value: 0, minSubtotal: null },
]

const BRAND = 'Véora'
const MONTHS: Record<string, number> = {
  January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
  July: 6, August: 7, September: 8, October: 9, November: 10, December: 11,
}

function parseReviewDate(value: string) {
  const match = /^(\w+) (\d+), (\d{4})$/.exec(value)
  if (!match || !(match[1] in MONTHS)) return new Date('2025-01-01T00:00:00Z').toISOString()
  return new Date(Date.UTC(Number(match[3]), MONTHS[match[1]], Number(match[2]))).toISOString()
}

type ProductRow = {
  id?: number
  slug: string
  sku: string
  title: string
  category: string
  type: string
  style: string
  description: string
  price: number
  oldPrice: number | null
  discount: number
  stock: number
  rating: number
  reviews: number
  arrivalDate: string
  isNew: boolean
  isFeatured: boolean
  images: string[]
  colors: string[]
  sizes: string[]
  features: string[]
}

function productStatements(product: ProductRow): InStatement[] {
  const statements: InStatement[] = [
    {
      sql: `INSERT INTO products (id, slug, sku, title, category, type, style, brand, description, price, old_price,
              discount, stock, rating, review_count, arrival_date, is_new, is_featured, is_demo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      args: [
        product.id ?? null, product.slug, product.sku, product.title, product.category, product.type, product.style,
        BRAND, product.description, product.price, product.oldPrice, product.discount, product.stock, product.rating,
        product.reviews, product.arrivalDate, product.isNew ? 1 : 0, product.isFeatured ? 1 : 0,
      ],
    },
  ]
  const pid = '(SELECT id FROM products WHERE slug = ?)'
  product.images.forEach((url, position) =>
    statements.push({ sql: `INSERT INTO product_images (product_id, position, url) VALUES (${pid}, ?, ?)`, args: [product.slug, position, url] })
  )
  product.colors.forEach((color) =>
    statements.push({ sql: `INSERT INTO product_colors (product_id, color) VALUES (${pid}, ?)`, args: [product.slug, color] })
  )
  product.sizes.forEach((size) =>
    statements.push({ sql: `INSERT INTO product_sizes (product_id, size) VALUES (${pid}, ?)`, args: [product.slug, size] })
  )
  product.features.forEach((feature, position) =>
    statements.push({ sql: `INSERT INTO product_features (product_id, position, feature) VALUES (${pid}, ?, ?)`, args: [product.slug, position, feature] })
  )
  return statements
}

export async function seedDatabase(db: Client) {
  const existing = await db.execute('SELECT COUNT(*) AS n FROM products')
  if (Number(existing.rows[0].n) > 0) return

  const categoryStatements: InStatement[] = Object.entries(CATEGORY_LABELS).map(([name, label], position) => ({
    sql: 'INSERT OR IGNORE INTO categories (name, label, position) VALUES (?, ?, ?)',
    args: [name, label, position],
  }))

  const catalogStatements: InStatement[] = []
  for (const item of baseProducts) {
    // The imported "Accessories" rows are unisex clothing, so they get their own category.
    const category = item.category === 'Accessories' ? 'Unisex' : item.category
    const gallery = resolveProductGallery({ id: item.id, type: item.type, category: item.category })
    const main = resolveProductImage({ id: item.id, type: item.type, category: item.category })
    catalogStatements.push(
      ...productStatements({
        id: item.id,
        slug: item.slug,
        sku: item.sku,
        title: item.title,
        category,
        type: item.type,
        style: item.style,
        description: item.description,
        price: item.price,
        oldPrice: item.oldPrice ?? null,
        discount: item.discount,
        stock: item.stock,
        rating: item.rating,
        reviews: item.reviews,
        arrivalDate: item.arrivalDate,
        isNew: item.isNew,
        isFeatured: item.isFeatured,
        images: [main, ...gallery.filter((url) => url !== main)],
        colors: item.colors,
        sizes: item.sizes,
        features: item.features,
      })
    )
  }

  VEORA_EDIT.forEach((item, index) => {
    const prefix = item.category === 'Footwear' ? 'FTW' : 'ACC'
    const discount = item.oldPrice ? Math.round((1 - item.price / item.oldPrice) * 100) : 0
    catalogStatements.push(
      ...productStatements({
        slug: item.slug,
        sku: `${prefix}-V${String(index + 1).padStart(3, '0')}`,
        title: item.title,
        category: item.category,
        type: item.type,
        style: item.style,
        description: item.description,
        price: item.price,
        oldPrice: item.oldPrice ?? null,
        discount,
        stock: item.stock,
        rating: 0,
        reviews: 0,
        arrivalDate: '2026-10-15',
        isNew: true,
        isFeatured: Boolean(item.bestseller),
        images: item.images,
        colors: item.colors,
        sizes: item.sizes,
        features: item.features,
      })
    )
  })

  type SeedReview = { name: string; rating: number; verified: boolean; date: string; comment: string }
  const reviewStatements: InStatement[] = []
  for (const [slug, list] of Object.entries(productReviews as Record<string, SeedReview[]>)) {
    for (const review of list) {
      reviewStatements.push({
        sql: `INSERT INTO reviews (product_id, author_name, rating, comment, verified, created_at)
              SELECT id, ?, ?, ?, ?, ? FROM products WHERE slug = ?`,
        args: [
          review.name,
          Math.min(5, Math.max(1, review.rating)),
          review.comment,
          review.verified ? 1 : 0,
          parseReviewDate(review.date),
          slug,
        ],
      })
    }
  }

  const couponStatements: InStatement[] = COUPON_SEED.map((coupon) => ({
    sql: 'INSERT INTO coupons (code, label, description, type, value, min_subtotal) VALUES (?, ?, ?, ?, ?, ?)',
    args: [coupon.code, coupon.label, coupon.description, coupon.type, coupon.value, coupon.minSubtotal],
  }))

  // Best sellers: the most-reviewed discounted hoodie, shirt, jacket and jeans, plus the Véora picks.
  const bestsellerStatements: InStatement[] = [
    ['Womens', 'Hoodie'],
    ['Mens', 'Shirts'],
    ['Mens', 'Jackets'],
    ['Womens', 'Jeans'],
  ].map(([category, type]) => ({
    sql: `UPDATE products SET is_bestseller = 1 WHERE id = (
            SELECT id FROM products WHERE category = ? AND type = ? AND discount > 0 AND stock > 0
            ORDER BY review_count DESC, rating DESC LIMIT 1)`,
    args: [category, type],
  }))
  for (const item of VEORA_EDIT.filter((entry) => entry.bestseller)) {
    bestsellerStatements.push({ sql: 'UPDATE products SET is_bestseller = 1 WHERE slug = ?', args: [item.slug] })
  }

  await db.batch([...categoryStatements, ...couponStatements], 'write')
  await db.batch(catalogStatements, 'write')
  await db.batch(reviewStatements, 'write')
  await db.batch(bestsellerStatements, 'write')
}
