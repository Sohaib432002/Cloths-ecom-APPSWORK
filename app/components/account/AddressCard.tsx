'use client'

import { useCallback, useEffect, useState } from 'react'
import { MapPin, Plus, Trash2 } from 'lucide-react'
import { apiFetch } from '@/lib/client/api'

type Address = {
  id: number
  label: string
  fullName: string
  phone: string
  address: string
  city: string
  country: string
  zipCode: string
  isDefault: boolean
}

const EMPTY = { label: 'Home', fullName: '', phone: '', address: '', city: '', country: 'Pakistan', zipCode: '', isDefault: false }
const input = 'mt-1 h-11 w-full rounded-xl border border-lavender-200 bg-white px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20'

export const Addresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loaded, setLoaded] = useState(false)
  const [form, setForm] = useState<typeof EMPTY | null>(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    const data = await apiFetch<{ addresses: Address[] }>('/api/addresses')
    setAddresses(data.addresses)
    setLoaded(true)
  }, [])

  useEffect(() => {
    void load().catch(() => setLoaded(true))
  }, [load])

  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!form) return
    setSaving(true)
    setError('')
    try {
      const data = await apiFetch<{ addresses: Address[] }>('/api/addresses', { method: 'POST', body: JSON.stringify(form) })
      setAddresses(data.addresses)
      setForm(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the address.')
    } finally {
      setSaving(false)
    }
  }

  const makeDefault = async (id: number) => {
    const data = await apiFetch<{ addresses: Address[] }>('/api/addresses', { method: 'PATCH', body: JSON.stringify({ id }) })
    setAddresses(data.addresses)
  }

  const remove = async (id: number) => {
    if (!window.confirm('Delete this address?')) return
    const data = await apiFetch<{ addresses: Address[] }>(`/api/addresses?id=${id}`, { method: 'DELETE' })
    setAddresses(data.addresses)
  }

  const field = (key: keyof typeof EMPTY, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => (
    <label className="text-sm font-medium">
      {label}
      <input
        required
        value={String(form?.[key] ?? '')}
        onChange={(event) => setForm((prev) => (prev ? { ...prev, [key]: event.target.value } : prev))}
        className={input}
        {...props}
      />
    </label>
  )

  return (
    <section aria-labelledby="addresses-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="addresses-title" className="text-2xl font-extrabold">
            Saved addresses
          </h2>
          <p className="mt-1 text-sm text-gray-500">Used to fill in checkout for you.</p>
        </div>
        <button
          type="button"
          onClick={() => setForm({ ...EMPTY })}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          <Plus size={16} /> Add address
        </button>
      </div>

      {form && (
        <form onSubmit={save} className="mt-6 grid gap-4 rounded-3xl border border-lavender-200 bg-white p-5 sm:grid-cols-2">
          {field('label', 'Name (Home, Office...)', { maxLength: 30 })}
          {field('fullName', 'Recipient name')}
          {field('phone', 'Phone', { type: 'tel' })}
          {field('city', 'City')}
          <div className="sm:col-span-2">{field('address', 'Street address')}</div>
          {field('country', 'Country')}
          {field('zipCode', 'Postal code')}
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(event) => setForm({ ...form, isDefault: event.target.checked })}
              className="h-4 w-4 accent-brand"
            />
            Use as my default address
          </label>
          {error && (
            <p role="alert" className="text-sm text-red-600 sm:col-span-2">
              {error}
            </p>
          )}
          <div className="flex gap-3 sm:col-span-2">
            <button type="submit" disabled={saving} className="h-11 rounded-full bg-brand px-7 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
              {saving ? 'Saving...' : 'Save address'}
            </button>
            <button type="button" onClick={() => setForm(null)} className="h-11 rounded-full border border-lavender-200 px-6 text-sm font-semibold">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loaded && addresses.length === 0 && !form && (
        <div className="mt-8 flex flex-col items-center rounded-3xl border border-dashed border-lavender-300 py-14 text-center">
          <MapPin size={36} className="text-brand-soft" />
          <p className="mt-4 font-semibold">No saved addresses</p>
          <p className="mt-1 text-sm text-gray-500">Add one to check out faster.</p>
        </div>
      )}

      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {addresses.map((item) => (
          <li key={item.id} className="rounded-3xl border border-lavender-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="font-semibold">
                {item.label}
                {item.isDefault && <span className="ml-2 rounded-full bg-lavender-100 px-2.5 py-0.5 text-xs text-brand-dark">Default</span>}
              </p>
              <button type="button" aria-label={`Delete ${item.label}`} onClick={() => void remove(item.id)} className="text-gray-400 hover:text-red-600">
                <Trash2 size={17} />
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              {item.fullName}
              <br />
              {item.address}, {item.city} {item.zipCode}
              <br />
              {item.country} · {item.phone}
            </p>
            {!item.isDefault && (
              <button type="button" onClick={() => void makeDefault(item.id)} className="mt-3 text-sm font-semibold text-brand hover:underline">
                Make default
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
