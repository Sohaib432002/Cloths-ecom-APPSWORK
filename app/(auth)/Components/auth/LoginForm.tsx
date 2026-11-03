'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { apiFetch } from '@/lib/client/api'
import { useAuth } from '@/context/AuthContext'
import type { SessionUser } from '@/types/product'

export const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { refresh } = useAuth()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await apiFetch<{ user: SessionUser }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      await refresh()
      router.push(searchParams.get('next') || '/')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <div>
        <label htmlFor="login-email" className="mb-2 block text-sm font-semibold">
          Email Address
        </label>
        <input
          id="login-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-full bg-[#F5F5F5] px-6 py-4 outline-none ring-brand focus:ring-2"
        />
      </div>
      <div>
        <label htmlFor="login-password" className="mb-2 block text-sm font-semibold">
          Password
        </label>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-full bg-[#F5F5F5] px-6 py-4 pr-14 outline-none ring-brand focus:ring-2"
          />
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-sm text-gray-500"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
      <div className="flex justify-end text-sm">
        <Link href="/forgot-password" className="font-semibold hover:underline">
          Forgot Password?
        </Link>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-brand py-4 font-semibold text-white hover:bg-brand-dark disabled:opacity-70"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  )
}
