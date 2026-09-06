'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { SessionUser } from '@/types/product'
import { apiFetch } from '@/lib/client/api'

type AuthContextType = {
  user: SessionUser | null
  loading: boolean
  refresh: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode
  initialUser: SessionUser | null
}) {
  const [user, setUser] = useState<SessionUser | null>(initialUser)
  const [loading, setLoading] = useState(!initialUser)

  const refresh = async () => {
    const data = await apiFetch<{ user: SessionUser | null }>('/api/auth/me')
    setUser(data.user)
    setLoading(false)
  }

  useEffect(() => {
    if (initialUser) {
      setLoading(false)
      return
    }
    refresh().catch(() => setLoading(false))
  }, [initialUser])

  const logout = async () => {
    await apiFetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }

  const value = useMemo(() => ({ user, loading, refresh, logout }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
