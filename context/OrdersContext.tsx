'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { AppliedCoupon, PaymentMethodId } from '@/types/product'

export type Order = {
  id: string
  status: string
  date: string
  payment: string
  paymentMethod?: PaymentMethodId
  paymentStatus?: string
  shipping: string
  email?: string
  items: {
    id: number
    title: string
    image: string
    quantity: number
    size?: string
    color?: string
    price: number
    slug?: string
  }[]
  address: {
    name: string
    phone: string
    address: string
    city: string
    country: string
    zipCode: string
  }
  coupon?: AppliedCoupon | null
  subtotal: number
  discount: number
  deliveryFee: number
  total: number
}

type OrdersContextType = {
  orders: Order[]
  ready: boolean
  addOrder: (order: Order) => void
  getOrder: (id: string) => Order | undefined
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([])
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('orders')
      if (saved) setOrders(JSON.parse(saved))
    } catch {
      setOrders([])
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    localStorage.setItem('orders', JSON.stringify(orders))
  }, [orders, ready])

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev.filter((item) => item.id !== order.id)])
  }

  const getOrder = (id: string) => orders.find((order) => order.id === id)

  return (
    <OrdersContext.Provider value={{ orders, ready, addOrder, getOrder }}>
      {children}
    </OrdersContext.Provider>
  )
}

export const useOrders = () => {
  const context = useContext(OrdersContext)
  if (!context) throw new Error('useOrders must be used inside OrdersProvider')
  return context
}
