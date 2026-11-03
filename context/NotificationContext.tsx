'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useOrders } from './OrdersContext'

export type AppNotification = {
  id: string
  title: string
  body: string
  href: string
  read: boolean
  createdAt: string
}

type NotificationContextType = {
  isOpen: boolean
  unreadCount: number
  notifications: AppNotification[]
  openNotifications: () => void
  closeNotifications: () => void
  toggleNotifications: () => void
  markAllRead: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { orders, ready } = useOrders()
  const [isOpen, setIsOpen] = useState(false)
  const [readIds, setReadIds] = useState<string[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('notification-read')
      if (saved) setReadIds(JSON.parse(saved))
    } catch {
      setReadIds([])
    }
  }, [])

  const notifications = useMemo<AppNotification[]>(() => {
    const orderNotes = orders.slice(0, 6).map((order) => ({
      id: `order-${order.id}`,
      title: `Order ${order.id} is ${order.status.toLowerCase()}`,
      body: `${order.items.length} item${order.items.length === 1 ? '' : 's'} · $${order.total.toFixed(2)}`,
      href: `/checkout/vieworders/${order.id}`,
      read: readIds.includes(`order-${order.id}`),
      createdAt: order.date,
    }))

    const welcome: AppNotification = {
      id: 'welcome',
      title: 'Your personal stylist is live',
      body: 'Describe an occasion and get a complete outfit from the Véora catalog.',
      href: '/stylist',
      read: readIds.includes('welcome'),
      createdAt: new Date().toISOString(),
    }

    return ready ? [welcome, ...orderNotes] : [welcome]
  }, [orders, readIds, ready])

  const unreadCount = notifications.filter((item) => !item.read).length

  const markAllRead = () => {
    const ids = notifications.map((item) => item.id)
    setReadIds(ids)
    localStorage.setItem('notification-read', JSON.stringify(ids))
  }

  const value = useMemo(
    () => ({
      isOpen,
      unreadCount,
      notifications,
      openNotifications: () => setIsOpen(true),
      closeNotifications: () => setIsOpen(false),
      toggleNotifications: () => setIsOpen((prev) => !prev),
      markAllRead,
    }),
    [isOpen, unreadCount, notifications]
  )

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) throw new Error('useNotification must be used inside NotificationProvider')
  return context
}
