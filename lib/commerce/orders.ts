import { randomInt } from 'node:crypto'
import type { InStatement } from '@libsql/client'
import { getDb } from '@/lib/db/client'
import { getOrderTotals, paymentLabel } from './pricing'
import { validateCoupon } from './coupons'
import { stripeEnabled } from '@/lib/payments/stripe'
import type { AppliedCoupon, PaymentMethodId, SessionUser } from '@/types/product'

export type CheckoutInput = {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  zipCode: string
  paymentMethod: PaymentMethodId
  couponCode?: string
  items: { id: number; quantity: number; size?: string; color?: string }[]
}

export class OrderError extends Error {
  code: string
  constructor(message: string, code = 'ORDER') {
    super(message)
    this.code = code
  }
}

function newOrderId() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let suffix = ''
  for (let i = 0; i < 6; i += 1) suffix += alphabet[randomInt(alphabet.length)]
  return `ORD-${suffix}`
}

export const ORDER_STATUSES = ['Pending payment', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as const

export async function createOrder(input: CheckoutInput, user: SessionUser | null) {
  const db = await getDb()

  if (input.paymentMethod === 'paypal') {
    throw new OrderError('PayPal is not available. Please choose another payment method.', 'PAYMENT')
  }
  if (input.paymentMethod === 'card' && !stripeEnabled()) {
    throw new OrderError('Card payments are not available yet. Please choose Cash on Delivery.', 'PAYMENT')
  }

  // merge duplicate lines of the same product so stock is checked against the total quantity
  const wanted = new Map<number, number>()
  for (const item of input.items) wanted.set(item.id, (wanted.get(item.id) || 0) + item.quantity)
  const ids = [...wanted.keys()]

  const found = await db.execute({
    sql: `SELECT p.id, p.title, p.price, p.stock,
            (SELECT url FROM product_images WHERE product_id = p.id ORDER BY position LIMIT 1) AS image
          FROM products p WHERE p.is_active = 1 AND p.id IN (${ids.map(() => '?').join(',')})`,
    args: ids,
  })
  const catalog = new Map(found.rows.map((row) => [Number(row.id), row]))

  for (const [id, quantity] of wanted) {
    const product = catalog.get(id)
    if (!product) throw new OrderError('One of the items in your bag is no longer available.', 'UNAVAILABLE')
    if (Number(product.stock) < quantity) {
      throw new OrderError(
        `Only ${product.stock} left of ${product.title}. Please reduce the quantity.`,
        'STOCK'
      )
    }
  }

  // prices always come from the database, never from the browser
  const lines = input.items.map((item) => {
    const product = catalog.get(item.id)!
    return {
      productId: item.id,
      title: String(product.title),
      image: String(product.image),
      size: item.size || null,
      color: item.color || null,
      quantity: item.quantity,
      price: Number(product.price),
    }
  })

  const subtotal = getOrderTotals(lines).subtotal
  let coupon: AppliedCoupon | null = null
  if (input.couponCode) {
    const result = await validateCoupon(input.couponCode, subtotal)
    if (!result.ok) throw new OrderError(result.error, 'COUPON')
    coupon = result.coupon
  }

  const totals = getOrderTotals(lines, coupon)
  const id = newOrderId()
  const createdAt = new Date().toISOString()
  const shippingLabel = totals.deliveryFee === 0 ? 'Free Shipping' : 'Standard Shipping'
  const paymentStatus = input.paymentMethod === 'cod' ? 'Pending' : 'Awaiting payment'
  const status = input.paymentMethod === 'cod' ? 'Processing' : 'Pending payment'

  try {
    await db.batch(
      [
        {
          sql: `INSERT INTO orders (id, user_id, email, status, payment_method, payment_status, shipping_label,
                  ship_name, ship_phone, ship_address, ship_city, ship_country, ship_zip, coupon_code,
                  subtotal, discount, delivery_fee, total, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [
            id, user?.id ?? null, input.email.trim().toLowerCase(), status, input.paymentMethod, paymentStatus, shippingLabel,
            `${input.firstName} ${input.lastName}`.trim(), input.phone, input.address, input.city, input.country,
            input.zipCode, coupon?.code ?? null, totals.subtotal, totals.discount, totals.deliveryFee, totals.total, createdAt,
          ],
        },
        ...lines.map((line) => ({
          sql: `INSERT INTO order_items (order_id, product_id, title, image, size, color, quantity, unit_price)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [id, line.productId, line.title, line.image, line.size, line.color, line.quantity, line.price],
        })),
        // the stock CHECK constraint aborts the whole batch if another order took the last units
        ...[...wanted].map(([productId, quantity]) => ({
          sql: 'UPDATE products SET stock = stock - ? WHERE id = ?',
          args: [quantity, productId],
        })),
      ],
      'write'
    )
  } catch (error) {
    if (error instanceof Error && /CHECK constraint/i.test(error.message)) {
      throw new OrderError('Some items just sold out. Please review your bag.', 'STOCK')
    }
    throw error
  }

  return (await getOrderById(id))!
}

function toOrder(row: Record<string, unknown>, items: Record<string, unknown>[]) {
  const code = row.coupon_code ? String(row.coupon_code) : null
  return {
    id: String(row.id),
    status: String(row.status),
    date: String(row.created_at),
    payment: paymentLabel(String(row.payment_method)),
    paymentMethod: String(row.payment_method) as PaymentMethodId,
    paymentStatus: String(row.payment_status),
    shipping: String(row.shipping_label),
    email: String(row.email),
    items: items.map((item) => ({
      id: Number(item.product_id),
      title: String(item.title),
      image: String(item.image),
      quantity: Number(item.quantity),
      size: item.size ? String(item.size) : undefined,
      color: item.color ? String(item.color) : undefined,
      price: Number(item.unit_price),
      slug: String(item.slug),
    })),
    address: {
      name: String(row.ship_name),
      phone: String(row.ship_phone),
      address: String(row.ship_address),
      city: String(row.ship_city),
      country: String(row.ship_country),
      zipCode: String(row.ship_zip),
    },
    coupon: code ? { code, label: String(row.coupon_label ?? code), type: row.coupon_type === 'shipping' ? 'shipping' : 'percent', value: Number(row.coupon_value ?? 0) } as AppliedCoupon : null,
    subtotal: Number(row.subtotal),
    discount: Number(row.discount),
    deliveryFee: Number(row.delivery_fee),
    total: Number(row.total),
  }
}

async function loadOrders(where: string, args: (string | number)[], limit = 500) {
  const db = await getDb()
  const orders = await db.execute({
    sql: `SELECT o.*, c.label AS coupon_label, c.type AS coupon_type, c.value AS coupon_value
          FROM orders o LEFT JOIN coupons c ON c.code = o.coupon_code
          ${where} ORDER BY o.created_at DESC LIMIT ${limit}`,
    args,
  })
  if (!orders.rows.length) return []

  const ids = orders.rows.map((row) => String(row.id))
  const items = await db.execute({
    sql: `SELECT i.*, p.slug FROM order_items i JOIN products p ON p.id = i.product_id
          WHERE i.order_id IN (${ids.map(() => '?').join(',')}) ORDER BY i.id`,
    args: ids,
  })

  return orders.rows.map((row) =>
    toOrder(
      row as unknown as Record<string, unknown>,
      items.rows.filter((item) => item.order_id === row.id) as unknown as Record<string, unknown>[]
    )
  )
}

export async function getOrderById(id: string) {
  const [order] = await loadOrders('WHERE o.id = ?', [id])
  return order || null
}

export async function listOrdersForUser(userId: string) {
  return loadOrders('WHERE o.user_id = ?', [userId])
}

export type OrderRecord = Awaited<ReturnType<typeof getOrderById>>

export async function markOrderPaid(id: string) {
  const db = await getDb()
  const result = await db.execute({
    sql: "UPDATE orders SET payment_status = 'Paid', status = 'Processing' WHERE id = ? AND payment_status != 'Paid'",
    args: [id],
  })
  return result.rowsAffected > 0
}

export async function updateOrderStatus(id: string, status: (typeof ORDER_STATUSES)[number]) {
  const db = await getDb()
  const current = await db.execute({ sql: 'SELECT status FROM orders WHERE id = ?', args: [id] })
  if (!current.rows.length) return false

  const statements: InStatement[] = [
    {
      sql: `UPDATE orders SET status = ?,
              payment_status = CASE WHEN ? = 'Delivered' AND payment_method = 'cod' THEN 'Paid' ELSE payment_status END
            WHERE id = ?`,
      args: [status, status, id],
    },
  ]
  if (status === 'Cancelled' && current.rows[0].status !== 'Cancelled') {
    // put the reserved units back on the shelf
    statements.push({
      sql: `UPDATE products SET stock = stock + COALESCE(
              (SELECT SUM(quantity) FROM order_items WHERE order_id = ? AND product_id = products.id), 0)
            WHERE id IN (SELECT product_id FROM order_items WHERE order_id = ?)`,
      args: [id, id],
    })
  }
  await db.batch(statements, 'write')
  return true
}

export async function listAllOrders(limit = 100) {
  return loadOrders(`WHERE 1 = 1`, [], limit)
}
