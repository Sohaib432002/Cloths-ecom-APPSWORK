'use client'

import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { apiFetch } from '@/lib/client/api'
import type { SessionUser } from '@/types/product'

export const Profiledetails = () => {
  const { user, refresh } = useAuth()
  const [firstName, setFirstName] = useState(user?.firstName || '')
  const [lastName, setLastName] = useState(user?.lastName || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [nextPassword, setNextPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      await apiFetch<{ user: SessionUser }>('/api/auth/me', {
        method: 'PATCH',
        body: JSON.stringify({ firstName, lastName, phone }),
      })
      await refresh()
      setMessage('Profile updated.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update profile.')
    } finally {
      setLoading(false)
    }
  }

  const savePassword = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      await apiFetch('/api/auth/me', {
        method: 'PATCH',
        body: JSON.stringify({ currentPassword, nextPassword }),
      })
      setCurrentPassword('')
      setNextPassword('')
      setMessage('Password updated.')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border p-6 sm:p-8">
        <h1 className="text-3xl font-bold">{user?.name || 'Your profile'}</h1>
        <p className="mt-1 text-gray-500">{user?.email}</p>
      </div>
      <form onSubmit={saveProfile} className="space-y-4 rounded-3xl border p-6">
        <h2 className="text-xl font-bold">Personal details</h2>
        <label className="block text-sm font-medium">
          First name
          <input
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className="mt-2 w-full rounded-2xl bg-gray-100 px-4 py-3 outline-none"
          />
        </label>
        <label className="block text-sm font-medium">
          Last name
          <input
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            className="mt-2 w-full rounded-2xl bg-gray-100 px-4 py-3 outline-none"
          />
        </label>
        <label className="block text-sm font-medium">
          Phone
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            className="mt-2 w-full rounded-2xl bg-gray-100 px-4 py-3 outline-none"
          />
        </label>
        <button type="submit" disabled={loading} className="rounded-full bg-black px-6 py-3 text-white">
          Save profile
        </button>
      </form>
      <form onSubmit={savePassword} className="space-y-4 rounded-3xl border p-6">
        <h2 className="text-xl font-bold">Password</h2>
        <label className="block text-sm font-medium">
          Current password
          <input
            type="password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className="mt-2 w-full rounded-2xl bg-gray-100 px-4 py-3 outline-none"
          />
        </label>
        <label className="block text-sm font-medium">
          New password
          <input
            type="password"
            value={nextPassword}
            onChange={(event) => setNextPassword(event.target.value)}
            className="mt-2 w-full rounded-2xl bg-gray-100 px-4 py-3 outline-none"
          />
        </label>
        <button type="submit" disabled={loading} className="rounded-full bg-black px-6 py-3 text-white">
          Update password
        </button>
      </form>
      {message && <p className="text-sm text-emerald-700">{message}</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}
