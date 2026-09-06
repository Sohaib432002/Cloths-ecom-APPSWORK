import type { AppliedCoupon, CartLine } from '@/types/product'

export const DELIVERY_FEE = 15
export const FREE_SHIPPING_THRESHOLD = 200

export const COUPONS: Record<
  string,
  AppliedCoupon & {
    minSubtotal?: number
    description: string
  }
> = {
  WELCOME20: {
    code: 'WELCOME20',
    label: '20% off your first order',
    type: 'percent',
    value: 20,
    minSubtotal: 40,
    description: 'New customers save 20% on orders over $40.',
  },
  SHOP10: {
    code: 'SHOP10',
    label: '10% off',
    type: 'percent',
    value: 10,
    description: 'Save 10% on any order.',
  },
  STYLE25: {
    code: 'STYLE25',
    label: '25% off outfits over $200',
    type: 'percent',
    value: 25,
    minSubtotal: 200,
    description: 'Save 25% when your bag totals $200 or more.',
  },
  FREESHIP: {
    code: 'FREESHIP',
    label: 'Free standard shipping',
    type: 'shipping',
    value: 0,
    description: 'Complimentary standard delivery on this order.',
  },
}

export function cartSubtotal(items: Pick<CartLine, 'price' | 'quantity'>[]) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0)
}

export function cartQuantity(items: Pick<CartLine, 'quantity'>[]) {
  return items.reduce((total, item) => total + item.quantity, 0)
}

export function getDeliveryFee(subtotal: number, coupon?: AppliedCoupon | null) {
  if (coupon?.type === 'shipping' || subtotal >= FREE_SHIPPING_THRESHOLD) return 0
  return subtotal > 0 ? DELIVERY_FEE : 0
}

export function getDiscount(subtotal: number, coupon?: AppliedCoupon | null) {
  if (!coupon || coupon.type !== 'percent') return 0
  return (subtotal * coupon.value) / 100
}

export function getOrderTotals(items: Pick<CartLine, 'price' | 'quantity'>[], coupon?: AppliedCoupon | null) {
  const subtotal = cartSubtotal(items)
  const discount = getDiscount(subtotal, coupon)
  const deliveryFee = getDeliveryFee(subtotal, coupon)
  const total = Math.max(0, subtotal - discount + deliveryFee)

  return { subtotal, discount, deliveryFee, total }
}

export function validateCoupon(code: string, subtotal: number) {
  const coupon = COUPONS[code.trim().toUpperCase()]
  if (!coupon) {
    return { ok: false as const, error: 'That coupon code is not valid.' }
  }
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return {
      ok: false as const,
      error: `This coupon requires a subtotal of at least $${coupon.minSubtotal}.`,
    }
  }
  return { ok: true as const, coupon }
}

export function formatMoney(amount: number, currency = '$') {
  return `${currency}${amount.toFixed(2)}`
}

export function paymentLabel(method: string) {
  if (method === 'card') return 'Credit / Debit Card'
  if (method === 'paypal') return 'PayPal'
  return 'Cash on Delivery'
}
