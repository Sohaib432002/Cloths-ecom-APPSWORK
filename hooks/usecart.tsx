'use client'

import { useContext, useEffect } from 'react'
import { CartContext } from '@/context/CartContext'

export const useCart = () => {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }

 
  return context
}
