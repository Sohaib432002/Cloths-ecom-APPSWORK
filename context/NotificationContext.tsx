'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useOrders } from './OrdersContext'
import { useAuth } from './AuthContext'

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
  markRead: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)
const STORAGE_KEY = 'veora_notifications_read'

// Notifications are built from the shopper's real orders; read state is remembered in this browser.
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { orders, ready } = useOrders()
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [readIds, setReadIds] = useState<string[]>([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setReadIds(JSON.parse(saved))
    } catch {
      setReadIds([])
    }
  }, [])

  const persist = useCallback((ids: string[]) => {
    setReadIds(ids)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
    } catch {}
  }, [])

  const notifications = useMemo<AppNotification[]>(() => {
    if (!ready) return []
    const orderNotes = orders.slice(0, 10).map((order) => {
      // the status is part of the id, so a status change shows up as a new unread notification
      const id = `order-${order.id}-${order.status}`
      return {
        id,
        title: `Order ${order.id} is ${order.status.toLowerCase()}`,
        body: `${order.items.length} item${order.items.length === 1 ? '' : 's'} · $${order.total.toFixed(2)} · ${order.payment}`,
        href: `/track?order=${order.id}`,
        read: readIds.includes(id),
        createdAt: order.date,
      }
    })

    const welcome: AppNotification[] = user
      ? [
          {
            id: 'welcome',
            title: `Welcome to Véora, ${user.firstName}`,
            body: 'Ask our assistant for outfit ideas or use code WELCOME20 on your first order.',
            href: '/stylist',
            read: readIds.includes('welcome'),
            createdAt: new Date(0).toISOString(),
          },
        ]
      : []

    return [...orderNotes, ...welcome]
  }, [orders, readIds, ready, user])

  const markAllRead = useCallback(() => persist(notifications.map((item) => item.id)), [notifications, persist])
  const markRead = useCallback(
    (id: string) => setReadIds((prev) => {
      if (prev.includes(id)) return prev
      const next = [...prev, id]
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {}
      return next
    }),
    []
  )

  // stable identities: components that list these in effect dependencies must not re-run when the panel opens
  const openNotifications = useCallback(() => setIsOpen(true), [])
  const closeNotifications = useCallback(() => setIsOpen(false), [])
  const toggleNotifications = useCallback(() => setIsOpen((prev) => !prev), [])

  const unreadCount = notifications.filter((item) => !item.read).length

  const value = useMemo(
    () => ({
      isOpen,
      unreadCount,
      notifications,
      openNotifications,
      closeNotifications,
      toggleNotifications,
      markAllRead,
      markRead,
    }),
    [isOpen, unreadCount, notifications, openNotifications, closeNotifications, toggleNotifications, markAllRead, markRead]
  )

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export const useNotification = () => {
  const context = useContext(NotificationContext)
  if (!context) throw new Error('useNotification must be used inside NotificationProvider')
  return context
}
