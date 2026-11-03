'use client'

import { useState } from 'react'
import { apiFetch } from '@/lib/client/api'

export const ForgotPasswordForm = () => {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [resetUrl, setResetUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const data = await apiFetch<{ message: string; resetUrl?: string }>('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
      setMessage(data.message)
      setResetUrl(data.resetUrl || '')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to start a reset.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="forgot-email" className="mb-2 block font-medium">
          Email Address
        </label>
        <input
          id="forgot-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-full bg-[#F4F0FF] px-5 py-4 outline-none"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {message && <p className="text-sm text-gray-600">{message}</p>}
      {resetUrl && (
        <a href={resetUrl} className="block break-all text-sm font-semibold underline">
          Continue to reset password
        </a>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-brand py-4 font-semibold text-white disabled:opacity-70"
      >
        {loading ? 'Sending...' : 'Send Reset Link'}
      </button>
    </form>
  )
}
