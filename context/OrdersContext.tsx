'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type Order = {
  id: string
  status: string
  date: string
  payment: string
  shipping: string

  items: {
    id: number
    title: string
    image: string
    quantity: number
    size?: string
    color?: string
    price: number
  }[]

  address: {
    name: string
    phone: string
    address: string
    city: string
    country: string
    zipCode: string
  }

  subtotal: number
  discount: number
  deliveryFee: number
  total: number
}

type OrdersContextType = {
  orders: Order[]

  addOrder: (order: Order) => void

  getOrder: (id: string) => Order | undefined
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined)

export const OrdersProvider = ({ children }: { children: React.ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    const savedOrders = localStorage.getItem('orders')

    if (savedOrders) {
      setOrders(JSON.parse(savedOrders))
    }
  }, [])

  const addOrder = (order: Order) => {
    const updatedOrders = [order, ...orders]

    setOrders(updatedOrders)

    localStorage.setItem('orders', JSON.stringify(updatedOrders))
  }

  const getOrder = (id: string) => {
    return orders.find((order) => order.id === id)
  }

  return (
    <OrdersContext.Provider
      value={{
        orders,

        addOrder,

        getOrder,
      }}
    >
      {children}
    </OrdersContext.Provider>
  )
}

export const useOrders = () => {
  const context = useContext(OrdersContext)

  if (!context) {
    throw new Error('useOrders must be used inside OrdersProvider')
  }

  return context
}
