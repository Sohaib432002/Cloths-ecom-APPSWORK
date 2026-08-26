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
}

export interface CartItem extends Product {
  quantity: number
}
