'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { AppliedCoupon, PaymentMethodId } from '@/types/product'
import { apiFetch } from '@/lib/client/api'
import { useAuth } from './AuthContext'

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

const GUEST_KEY = 'veora_guest_orders'

// Signed-in shoppers read their orders from the database; guests keep the orders they placed in this browser.
export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [guestOrders, setGuestOrders] = useState<Order[]>([])
  const [ready, setReady] = useState(false)
  const userId = user?.id

  useEffect(() => {
    try {
      const saved = localStorage.getItem(GUEST_KEY)
      if (saved) setGuestOrders(JSON.parse(saved))
    } catch {
      setGuestOrders([])
    }
  }, [])

  useEffect(() => {
    if (loading) return
    if (!userId) {
      setOrders([])
      setReady(true)
      return
    }

    let cancelled = false
    apiFetch<{ orders: Order[] }>('/api/orders')
      .then((data) => !cancelled && setOrders(data.orders))
      .catch(() => !cancelled && setOrders([]))
      .finally(() => !cancelled && setReady(true))
    return () => {
      cancelled = true
    }
  }, [userId, loading])

  const addOrder = (order: Order) => {
    if (userId) {
      setOrders((prev) => [order, ...prev.filter((item) => item.id !== order.id)])
      return
    }
    setGuestOrders((prev) => {
      const next = [order, ...prev.filter((item) => item.id !== order.id)]
      try {
        localStorage.setItem(GUEST_KEY, JSON.stringify(next))
      } catch {}
      return next
    })
  }

  const visible = userId ? orders : guestOrders
  const getOrder = (id: string) => visible.find((order) => order.id === id)

  return (
    <OrdersContext.Provider value={{ orders: visible, ready, addOrder, getOrder }}>
      {children}
    </OrdersContext.Provider>
  )
}

export const useOrders = () => {
  const context = useContext(OrdersContext)
  if (!context) throw new Error('useOrders must be used inside OrdersProvider')
  return context
}
