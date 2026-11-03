'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/client/api'
import { useAuth } from '@/context/AuthContext'

export const SignupForm = () => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agree, setAgree] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { refresh } = useAuth()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (!agree) {
      setError('Please accept the terms to create an account.')
      return
    }

    setLoading(true)
    setError('')
    try {
      await apiFetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ fullName, email, password }),
      })
      await refresh()
      router.push('/')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="signup-name" className="mb-2 block font-medium">
          Full Name
        </label>
        <input
          id="signup-name"
          required
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className="w-full rounded-full bg-[#F4F0FF] px-5 py-4 outline-none"
        />
      </div>
      <div>
        <label htmlFor="signup-email" className="mb-2 block font-medium">
          Email Address
        </label>
        <input
          id="signup-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="w-full rounded-full bg-[#F4F0FF] px-5 py-4 outline-none"
        />
      </div>
      <div>
        <label htmlFor="signup-password" className="mb-2 block font-medium">
          Password
        </label>
        <input
          id="signup-password"
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-full bg-[#F4F0FF] px-5 py-4 outline-none"
        />
        <p className="mt-2 text-xs text-gray-500">Use 8+ characters with a number and an uppercase letter.</p>
      </div>
      <div>
        <label htmlFor="signup-confirm" className="mb-2 block font-medium">
          Confirm Password
        </label>
        <input
          id="signup-confirm"
          type="password"
          required
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className="w-full rounded-full bg-[#F4F0FF] px-5 py-4 outline-none"
        />
      </div>
      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" checked={agree} onChange={(event) => setAgree(event.target.checked)} className="mt-1" />
        <span className="text-gray-600">I agree to the Terms & Conditions and Privacy Policy.</span>
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-brand py-4 font-semibold text-white hover:bg-brand-dark disabled:opacity-70"
      >
        {loading ? 'Creating account...' : 'Create Account'}
      </button>
    </form>
  )
}
