import type { AppliedCoupon, CartLine } from '@/types/product'

export const DELIVERY_FEE = 15
export const FREE_SHIPPING_THRESHOLD = 200

const round = (value: number) => Math.round(value * 100) / 100

export function cartSubtotal(items: Pick<CartLine, 'price' | 'quantity'>[]) {
  return round(items.reduce((total, item) => total + item.price * item.quantity, 0))
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
  return round((subtotal * coupon.value) / 100)
}

export function getOrderTotals(items: Pick<CartLine, 'price' | 'quantity'>[], coupon?: AppliedCoupon | null) {
  const subtotal = cartSubtotal(items)
  const discount = getDiscount(subtotal, coupon)
  const deliveryFee = getDeliveryFee(subtotal, coupon)
  const total = Math.max(0, round(subtotal - discount + deliveryFee))

  return { subtotal, discount, deliveryFee, total }
}

export function formatMoney(amount: number, currency = '$') {
  return `${currency}${amount.toFixed(2)}`
}

export function paymentLabel(method: string) {
  if (method === 'card') return 'Credit / Debit Card'
  if (method === 'paypal') return 'PayPal'
  return 'Cash on Delivery'
}
