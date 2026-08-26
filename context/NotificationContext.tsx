'use client'

import { createContext, useContext, useMemo, useState, ReactNode } from 'react'

type NotificationContextType = {
  isOpen: boolean
  unreadCount: number

  openNotifications: () => void
  closeNotifications: () => void
  toggleNotifications: () => void

  setUnreadCount: (count: number) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const value = useMemo(
    () => ({
      isOpen,
      unreadCount,

      openNotifications: () => setIsOpen(true),

      closeNotifications: () => setIsOpen(false),

      toggleNotifications: () => setIsOpen((prev) => !prev),

      setUnreadCount,
    }),
    [isOpen, unreadCount]
  )

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export const useNotification = () => {
  const context = useContext(NotificationContext)

  if (!context) {
    throw new Error('useNotification must be used inside NotificationProvider')
  }

  return context
}
