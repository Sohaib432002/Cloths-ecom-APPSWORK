'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type ProductCard = {
  id: number
  slug: string
  title: string
  price: number
  image: string
  rating: number
  discount: number
  sizes: string[]
  colors: string[]
}

interface WishlistContextType {
  wishlist: ProductCard[]

  addToWishlist: (product: ProductCard) => void

  removeFromWishlist: (id: number) => void

  isInWishlist: (id: number) => boolean

  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<ProductCard[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('wishlist')

    if (saved) {
      setWishlist(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const addToWishlist = (product: ProductCard) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id)

      if (exists) return prev

      return [...prev, product]
    })
  }

  const removeFromWishlist = (id: number) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id))
  }

  const isInWishlist = (id: number): boolean => {
    return wishlist.some((item) => item.id === id)
  }

  const clearWishlist = () => {
    setWishlist([])
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)

  if (!context) {
    throw new Error('useWishlist must be used inside WishlistProvider')
  }

  return context
}
