'use client'

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import type { ProductCardData } from '@/types/product'
import { apiFetch } from '@/lib/client/api'
import { useAuth } from './AuthContext'

interface WishlistContextType {
  wishlist: ProductCardData[]
  ready: boolean
  addToWishlist: (product: ProductCardData) => void
  removeFromWishlist: (id: number) => void
  isInWishlist: (id: number) => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

type ServerWishlist = { productIds: number[]; products: ProductCardData[] }

// Saved items live in localStorage; for signed-in shoppers they are also stored in the database,
// so the list follows the account across devices.
export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth()
  const [wishlist, setWishlist] = useState<ProductCardData[]>([])
  const [ready, setReady] = useState(false)
  const syncedFor = useRef<string | null>(null)
  const userId = user?.id

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
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlist))
    } catch {}
  }, [wishlist, ready])

  // on sign-in: merge what this browser saved with what the account already has
  useEffect(() => {
    if (!ready || loading) return
    if (!userId) {
      // signed out: do not leave the previous account's saved items behind
      if (syncedFor.current) setWishlist([])
      syncedFor.current = null
      return
    }
    if (syncedFor.current === userId) return

    let cancelled = false
    apiFetch<ServerWishlist>('/api/wishlist')
      .then((server) => {
        if (cancelled) return
        const merged = [...server.products]
        for (const item of wishlist) if (!merged.some((entry) => entry.id === item.id)) merged.push(item)
        syncedFor.current = userId
        setWishlist(merged)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, ready, loading])

  // after the first merge, push every change to the account
  useEffect(() => {
    if (!userId || syncedFor.current !== userId) return
    const timer = setTimeout(() => {
      apiFetch('/api/wishlist', {
        method: 'PUT',
        body: JSON.stringify({ productIds: wishlist.map((item) => item.id) }),
      }).catch(() => {})
    }, 400)
    return () => clearTimeout(timer)
  }, [wishlist, userId])

  const addToWishlist = (product: ProductCardData) => {
    setWishlist((prev) => (prev.some((item) => item.id === product.id) ? prev : [...prev, product]))
  }

  const removeFromWishlist = (id: number) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id))
  }

  const isInWishlist = (id: number) => wishlist.some((item) => item.id === id)

  const clearWishlist = () => {
    setWishlist([])
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
