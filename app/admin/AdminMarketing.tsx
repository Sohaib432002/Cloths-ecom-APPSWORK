'use client'

import { useCallback, useEffect, useState } from 'react'
import { apiFetch } from '@/lib/client/api'

type Coupon = { code: string; type: string; value: number; minSubtotal: number | null; description: string; active: boolean; uses: number }

const input = 'mt-1 h-11 w-full rounded-xl border border-lavender-200 bg-white px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20'

function Notice({ state }: { state: { ok: boolean; text: string } | null }) {
  if (!state) return null
  return (
    <p role="status" className={`mt-3 rounded-xl px-4 py-3 text-sm ${state.ok ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`}>
      {state.text}
    </p>
  )
}

export function AdminMarketing() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [form, setForm] = useState({ code: '', type: 'percent', value: '10', minSubtotal: '' })
  const [couponNote, setCouponNote] = useState<{ ok: boolean; text: string } | null>(null)

  const [announcement, setAnnouncement] = useState('')
  const [announceNote, setAnnounceNote] = useState<{ ok: boolean; text: string } | null>(null)

  const [mail, setMail] = useState({ subject: '', message: '', couponCode: '' })
  const [mailNote, setMailNote] = useState<{ ok: boolean; text: string } | null>(null)
  const [sending, setSending] = useState(false)

  const load = useCallback(async () => {
    const [c, s] = await Promise.all([
      apiFetch<{ coupons: Coupon[] }>('/api/admin/coupons'),
      apiFetch<{ announcement: string }>('/api/admin/settings'),
    ])
    setCoupons(c.coupons)
    setAnnouncement(s.announcement)
  }, [])

  useEffect(() => {
    void load().catch(() => {})
  }, [load])

  const addCoupon = async (event: React.FormEvent) => {
    event.preventDefault()
    setCouponNote(null)
    try {
      await apiFetch('/api/admin/coupons', {
        method: 'POST',
        body: JSON.stringify({
          code: form.code,
          type: form.type,
          value: form.type === 'shipping' ? 0 : Number(form.value),
          minSubtotal: form.minSubtotal ? Number(form.minSubtotal) : null,
        }),
      })
      setForm({ code: '', type: 'percent', value: '10', minSubtotal: '' })
      setCouponNote({ ok: true, text: 'Coupon created. Customers can use it right away.' })
      await load()
    } catch (err) {
      setCouponNote({ ok: false, text: err instanceof Error ? err.message : 'Could not create the coupon.' })
    }
  }

  const toggle = async (coupon: Coupon) => {
    await apiFetch(`/api/admin/coupons/${coupon.code}`, { method: 'PATCH', body: JSON.stringify({ active: !coupon.active }) })
    await load()
  }

  const remove = async (coupon: Coupon) => {
    if (!window.confirm(`Delete coupon ${coupon.code}?`)) return
    await apiFetch(`/api/admin/coupons/${coupon.code}`, { method: 'DELETE' })
    await load()
  }

  const saveAnnouncement = async (text: string) => {
    setAnnounceNote(null)
    try {
      await apiFetch('/api/admin/settings', { method: 'PUT', body: JSON.stringify({ announcement: text }) })
      setAnnouncement(text)
      setAnnounceNote({ ok: true, text: text ? 'Announcement saved. It shows at the top of every page.' : 'Announcement bar turned off.' })
    } catch (err) {
      setAnnounceNote({ ok: false, text: err instanceof Error ? err.message : 'Could not save.' })
    }
  }

  const send = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!window.confirm('Send this email to all newsletter subscribers?')) return
    setSending(true)
    setMailNote(null)
    try {
      const data = await apiFetch<{ sent: number; total: number }>('/api/admin/broadcast', {
        method: 'POST',
        body: JSON.stringify({ subject: mail.subject, message: mail.message, couponCode: mail.couponCode || undefined }),
      })
      setMailNote({ ok: true, text: `Sent to ${data.sent} of ${data.total} subscribers.` })
      setMail({ subject: '', message: '', couponCode: '' })
    } catch (err) {
      setMailNote({ ok: false, text: err instanceof Error ? err.message : 'Could not send.' })
    } finally {
      setSending(false)
    }
  }

  const card = 'rounded-3xl border border-lavender-200 bg-white p-5 sm:p-6'

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className={card}>
        <h3 className="text-lg font-bold">Coupon codes</h3>
        <form onSubmit={addCoupon} className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-medium">
            Code
            <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="EID20" className={input} />
          </label>
          <label className="text-sm font-medium">
            Type
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={input}>
              <option value="percent">Percent off</option>
              <option value="shipping">Free delivery</option>
            </select>
          </label>
          {form.type === 'percent' && (
            <label className="text-sm font-medium">
              Percent (%)
              <input type="number" min={1} max={100} required value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className={input} />
            </label>
          )}
          <label className="text-sm font-medium">
            Minimum order ($), optional
            <input type="number" min={0} value={form.minSubtotal} onChange={(e) => setForm({ ...form, minSubtotal: e.target.value })} className={input} />
          </label>
          <button type="submit" className="h-11 rounded-full bg-brand px-6 text-sm font-semibold text-white hover:bg-brand-dark sm:col-span-2">
            Create coupon
          </button>
        </form>
        <Notice state={couponNote} />

        <ul className="mt-5 divide-y divide-lavender-100 text-sm">
          {coupons.map((coupon) => (
            <li key={coupon.code} className={`flex items-center justify-between gap-3 py-3 ${coupon.active ? '' : 'opacity-50'}`}>
              <div>
                <p className="font-semibold">{coupon.code}</p>
                <p className="text-xs text-gray-500">
                  {coupon.description} · used {coupon.uses}×
                </p>
              </div>
              <div className="flex shrink-0 gap-3">
                <button type="button" onClick={() => void toggle(coupon)} className="text-brand hover:underline">
                  {coupon.active ? 'Turn off' : 'Turn on'}
                </button>
                <button type="button" onClick={() => void remove(coupon)} className="text-red-600 hover:underline">
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="space-y-8">
        <section className={card}>
          <h3 className="text-lg font-bold">Announcement bar</h3>
          <p className="mt-1 text-sm text-gray-500">The message in the purple strip at the top of every page.</p>
          <textarea
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            maxLength={160}
            rows={2}
            className={`${input} mt-3 h-auto py-2`}
            aria-label="Announcement text"
          />
          <div className="mt-3 flex gap-3">
            <button type="button" onClick={() => void saveAnnouncement(announcement)} className="h-11 rounded-full bg-brand px-6 text-sm font-semibold text-white hover:bg-brand-dark">
              Save
            </button>
            <button type="button" onClick={() => void saveAnnouncement('')} className="h-11 rounded-full border border-lavender-200 px-6 text-sm font-semibold">
              Turn off
            </button>
          </div>
          <Notice state={announceNote} />
        </section>

        <section className={card}>
          <h3 className="text-lg font-bold">Email your subscribers</h3>
          <p className="mt-1 text-sm text-gray-500">Send an offer or news to everyone who joined the newsletter (needs email set up).</p>
          <form onSubmit={send} className="mt-3 space-y-3">
            <label className="block text-sm font-medium">
              Subject
              <input required minLength={3} value={mail.subject} onChange={(e) => setMail({ ...mail, subject: e.target.value })} className={input} />
            </label>
            <label className="block text-sm font-medium">
              Message
              <textarea required minLength={10} rows={4} value={mail.message} onChange={(e) => setMail({ ...mail, message: e.target.value })} className={`${input} h-auto py-2`} />
            </label>
            <label className="block text-sm font-medium">
              Coupon code to highlight, optional
              <input value={mail.couponCode} onChange={(e) => setMail({ ...mail, couponCode: e.target.value.toUpperCase() })} className={input} />
            </label>
            <button type="submit" disabled={sending} className="h-11 rounded-full bg-brand px-6 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
              {sending ? 'Sending...' : 'Send email'}
            </button>
          </form>
          <Notice state={mailNote} />
        </section>
      </div>
    </div>
  )
}
