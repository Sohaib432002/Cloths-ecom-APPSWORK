'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { apiFetch } from '@/lib/client/api'
import { useAuth } from '@/context/AuthContext'

export const VerifyEmailForm = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { refresh } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const token = searchParams.get('token') || ''

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      await apiFetch('/api/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ token }),
      })
      await refresh()
      router.push('/account/profile?Tab=Dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to verify email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <p className="text-sm text-gray-600">
        Open this page from the verification link to confirm your email address.
      </p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading || !token}
        className="w-full rounded-full bg-black py-4 font-semibold text-white disabled:opacity-70"
      >
        {loading ? 'Verifying...' : 'Verify Email'}
      </button>
    </form>
  )
}
