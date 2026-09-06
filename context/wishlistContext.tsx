'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { ProductCardData } from '@/types/product'

interface WishlistContextType {
  wishlist: ProductCardData[]
  ready: boolean
  addToWishlist: (product: ProductCardData) => void
  removeFromWishlist: (id: number) => void
  isInWishlist: (id: number) => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<ProductCardData[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('wishlist')
      if (saved) setWishlist(JSON.parse(saved))
    } catch {
      setWishlist([])
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }, [wishlist, ready])

  const addToWishlist = (product: ProductCardData) => {
    setWishlist((prev) => (prev.some((item) => item.id === product.id) ? prev : [...prev, product]))
  }

  const removeFromWishlist = (id: number) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id))
  }

  const isInWishlist = (id: number) => wishlist.some((item) => item.id === id)

  const clearWishlist = () => {
    setWishlist([])
    localStorage.removeItem('wishlist')
  }

  return (
    <WishlistContext.Provider
      value={{ wishlist, ready, addToWishlist, removeFromWishlist, isInWishlist, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) throw new Error('useWishlist must be used inside WishlistProvider')
  return context
}
