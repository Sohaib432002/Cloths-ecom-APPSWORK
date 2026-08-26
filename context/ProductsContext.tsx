'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

import { Product } from '@/types/product'
import { getProducts } from '../services/getProducts'

interface ProductContextType {
  products: Product[]
  loading: boolean
  error: string | null
  refreshProducts: () => Promise<void>
}

const ProductContext = createContext<ProductContextType | undefined>(undefined)

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshProducts = async () => {
    try {
      setLoading(true)

      const data = await getProducts()

      setProducts(data)
      setError(null)
    } catch (err) {
      setError('Failed to load products')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshProducts()
  }, [])

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        error,
        refreshProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

export const useProducts = () => {
  const context = useContext(ProductContext)

  if (!context) {
    throw new Error('useProducts must be used inside ProductProvider')
  }

  return context
}
