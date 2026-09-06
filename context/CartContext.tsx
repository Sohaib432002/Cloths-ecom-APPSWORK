'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { AppliedCoupon, CartLine, ProductCardData } from '@/types/product'

export function makeLineId(id: number, size = '', color = '') {
  return `${id}-${size || 'any'}-${color || 'any'}`
}

type CartContextType = {
  cart: CartLine[]
  ready: boolean
  addToCart: (product: ProductCardData & { size?: string; color?: string; quantity?: number }) => void
  removeFromCart: (lineId: string) => void
  increaseQuantity: (lineId: string) => void
  decreaseQuantity: (lineId: string) => void
  clearCart: () => void
  coupon: AppliedCoupon | null
  setCoupon: (coupon: AppliedCoupon | null) => void
}

const CartContext = createContext<CartContextType | null>(null)

function readCart(): CartLine[] {
  try {
    const raw = localStorage.getItem('Cartitems')
    if (!raw) return []
    const parsed = JSON.parse(raw) as Array<CartLine & { sizes?: string[]; colors?: string[] }>
    return parsed.map((item) => ({
      lineId: item.lineId || makeLineId(item.id, item.size, item.color),
      id: item.id,
      slug: item.slug,
      title: item.title,
      price: item.price,
      image: item.image,
      rating: item.rating,
      discount: item.discount,
      stock: item.stock || 20,
      quantity: item.quantity || 1,
      size: item.size || item.sizes?.[0] || '',
      color: item.color || item.colors?.[0] || '',
    }))
  } catch {
    return []
  }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartLine[]>([])
  const [ready, setReady] = useState(false)
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null)

  useEffect(() => {
    setCart(readCart())
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    localStorage.setItem('Cartitems', JSON.stringify(cart))
  }, [cart, ready])

  const addToCart: CartContextType['addToCart'] = (product) => {
    const size = product.size || product.sizes[0] || ''
    const color = product.color || product.colors[0] || ''
    const lineId = makeLineId(product.id, size, color)
    const quantity = product.quantity || 1

    setCart((prev) => {
      const existing = prev.find((item) => item.lineId === lineId)
      if (existing) {
        return prev.map((item) =>
          item.lineId === lineId
            ? { ...item, quantity: Math.min(item.stock, item.quantity + quantity) }
            : item
        )
      }

      return [
        ...prev,
        {
          lineId,
          id: product.id,
          slug: product.slug,
          title: product.title,
          price: product.price,
          image: product.image,
          rating: product.rating,
          discount: product.discount,
          stock: product.stock || 20,
          quantity,
          size,
          color,
        },
      ]
    })
  }

  const removeFromCart = (lineId: string) => {
    setCart((prev) => prev.filter((item) => item.lineId !== lineId))
  }

  const increaseQuantity = (lineId: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.lineId === lineId
          ? { ...item, quantity: Math.min(item.stock, item.quantity + 1) }
          : item
      )
    )
  }

  const decreaseQuantity = (lineId: string) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.lineId === lineId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const clearCart = () => {
    setCart([])
    setCoupon(null)
    localStorage.removeItem('Cartitems')
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        ready,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        coupon,
        setCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCartContext = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}

export { CartContext }
