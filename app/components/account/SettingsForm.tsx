'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { apiFetch } from '@/lib/client/api'
import { useAuth } from '@/context/AuthContext'

const input = 'mt-1 h-12 w-full rounded-xl border border-lavender-200 bg-white px-4 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20'

export const Settings = () => {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [state, setState] = useState<{ ok: boolean; text: string } | null>(null)
  const [saving, setSaving] = useState(false)

  const changePassword = async (event: React.FormEvent) => {
    event.preventDefault()
    setSaving(true)
    setState(null)
    try {
      await apiFetch('/api/auth/me', { method: 'PATCH', body: JSON.stringify({ currentPassword: current, nextPassword: next }) })
      setCurrent('')
      setNext('')
      setState({ ok: true, text: 'Your password has been changed.' })
    } catch (err) {
      setState({ ok: false, text: err instanceof Error ? err.message : 'Could not change the password.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <section aria-labelledby="settings-title" className="max-w-xl">
      <h2 id="settings-title" className="text-2xl font-extrabold">
        Settings
      </h2>
      <p className="mt-1 text-sm text-gray-500">Signed in as {user?.email}</p>

      <form onSubmit={changePassword} className="mt-6 space-y-4 rounded-3xl border border-lavender-200 bg-white p-6">
        <h3 className="font-bold">Change password</h3>
        <label className="block text-sm font-medium">
          Current password
          <input type="password" required autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} className={input} />
        </label>
        <label className="block text-sm font-medium">
          New password
          <input type="password" required minLength={8} autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} className={input} />
          <span className="mt-1 block text-xs text-gray-500">At least 8 characters, with a capital letter and a number.</span>
        </label>
        {state && (
          <p role="status" className={`text-sm ${state.ok ? 'text-emerald-700' : 'text-red-600'}`}>
            {state.text}
          </p>
        )}
        <button type="submit" disabled={saving} className="h-11 rounded-full bg-brand px-7 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
          {saving ? 'Saving...' : 'Update password'}
        </button>
      </form>

      <button
        type="button"
        onClick={() => logout().then(() => router.push('/'))}
        className="mt-6 h-11 rounded-full border border-lavender-300 px-7 text-sm font-semibold hover:bg-lavender-50"
      >
        Sign out
      </button>
    </section>
  )
}
