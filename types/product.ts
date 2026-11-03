export interface Product {
  id: number
  title: string
  slug: string
  category: string
  type: string
  brand: string
  price: number
  oldPrice: number | null
  discount: number
  currency: string
  rating: number
  reviews: number
  stock: number
  sku: string
  arrivalDate: string
  image: string
  gallery: string[]
  colors: string[]
  sizes: string[]
  style: string
  description: string
  features: string[]
  isNew: boolean
  isFeatured: boolean
  isBestseller?: boolean
}

export type CartLine = {
  lineId: string
  id: number
  slug: string
  title: string
  price: number
  image: string
  rating: number
  discount: number
  stock: number
  quantity: number
  size: string
  color: string
}

export type ProductCardData = {
  id: number
  slug: string
  title: string
  price: number
  oldPrice?: number | null
  image: string
  rating: number
  reviews?: number
  discount: number
  sizes: string[]
  colors: string[]
  stock?: number
}

export type PaymentMethodId = 'cod' | 'card' | 'paypal'

export type AppliedCoupon = {
  code: string
  label: string
  type: 'percent' | 'shipping'
  value: number
}

export type SessionUser = {
  id: string
  email: string
  name: string
  firstName: string
  lastName: string
  phone?: string
  emailVerified: boolean
}

export type ProductReview = {
  id: number
  name: string
  rating: number
  verified: boolean
  date: string
  comment: string
}

export type ProductQuery = {
  search?: string
  category?: string
  type?: string
  style?: string
  color?: string
  size?: string
  sale?: boolean
  arrival?: boolean
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
  sort?: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest'
}
