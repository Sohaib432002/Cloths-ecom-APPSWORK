'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { apiFetch } from '@/lib/client/api'

export const ResetPasswordForm = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const token = searchParams.get('token') || ''

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await apiFetch('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
      })
      router.push('/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reset password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {!token && <p className="text-sm text-red-600">This reset link is missing a token.</p>}
      <div>
        <label htmlFor="reset-password" className="mb-2 block font-medium">
          New Password
        </label>
        <input
          id="reset-password"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-full bg-[#F4F0FF] px-5 py-4 outline-none"
        />
      </div>
      <div>
        <label htmlFor="reset-confirm" className="mb-2 block font-medium">
          Confirm Password
        </label>
        <input
          id="reset-confirm"
          type="password"
          required
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="w-full rounded-full bg-[#F4F0FF] px-5 py-4 outline-none"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading || !token}
        className="w-full rounded-full bg-brand py-4 font-semibold text-white disabled:opacity-70"
      >
        {loading ? 'Updating...' : 'Reset Password'}
      </button>
    </form>
  )
}
