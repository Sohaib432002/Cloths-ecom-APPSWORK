'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { Plus, Search, Upload, X } from 'lucide-react'
import { apiFetch } from '@/lib/client/api'
import { CATALOG_FACETS, categoryLabel } from '@/lib/catalog/facets'

type Row = { id: number; title: string; sku: string; category: string; price: number; stock: number; active: boolean; image: string }

type Form = {
  id?: number
  title: string
  category: string
  type: string
  style: string
  price: string
  oldPrice: string
  stock: string
  description: string
  colors: string
  sizes: string
  features: string
  images: string[]
  isNew: boolean
  isFeatured: boolean
  isBestseller: boolean
}

const EMPTY: Form = {
  title: '',
  category: 'Womens',
  type: 'Hoodie',
  style: 'Casual',
  price: '',
  oldPrice: '',
  stock: '10',
  description: '',
  colors: 'Black',
  sizes: 'S, M, L, XL',
  features: '',
  images: [],
  isNew: true,
  isFeatured: false,
  isBestseller: false,
}

const split = (value: string) =>
  value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean)

/** Shrinks a photo to at most 1200px and re-encodes it as JPEG so uploads stay small and fast. */
async function shrink(file: File) {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, 1200 / Math.max(bitmap.width, bitmap.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(bitmap.width * scale)
  canvas.height = Math.round(bitmap.height * scale)
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not read that photo.'))), 'image/jpeg', 0.85)
  )
}

const input = 'mt-1 h-11 w-full rounded-xl border border-lavender-200 bg-white px-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20'

export function AdminProducts() {
  const [query, setQuery] = useState('')
  const [rows, setRows] = useState<Row[]>([])
  const [total, setTotal] = useState(0)
  const [form, setForm] = useState<Form | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  const load = useCallback(async (q: string) => {
    const data = await apiFetch<{ items: Row[]; total: number }>(`/api/admin/products?q=${encodeURIComponent(q)}`)
    setRows(data.items)
    setTotal(data.total)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => void load(query).catch(() => {}), 250)
    return () => clearTimeout(timer)
  }, [query, load])

  const note = (ok: boolean, text: string) => setMessage({ ok, text })

  const edit = async (id: number) => {
    setMessage(null)
    const { product } = await apiFetch<{ product: Omit<Form, 'price' | 'oldPrice' | 'stock' | 'colors' | 'sizes' | 'features'> & { price: number; oldPrice: number | null; stock: number; colors: string[]; sizes: string[]; features: string[] } }>(`/api/admin/products/${id}`)
    setForm({
      ...product,
      id,
      price: String(product.price),
      oldPrice: product.oldPrice ? String(product.oldPrice) : '',
      stock: String(product.stock),
      colors: product.colors.join(', '),
      sizes: product.sizes.join(', '),
      features: product.features.join('\n'),
    })
  }

  const upload = async (files: FileList | null) => {
    if (!files?.length || !form) return
    setBusy(true)
    try {
      const urls: string[] = []
      for (const file of Array.from(files).slice(0, 8 - form.images.length)) {
        const blob = await shrink(file)
        const res = await apiFetch<{ url: string }>('/api/admin/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'image/jpeg' },
          body: blob,
        })
        urls.push(res.url)
      }
      setForm({ ...form, images: [...form.images, ...urls] })
    } catch (err) {
      note(false, err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setBusy(false)
    }
  }

  const save = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!form) return
    setBusy(true)
    setMessage(null)
    try {
      const body = JSON.stringify({
        title: form.title,
        category: form.category,
        type: form.type,
        style: form.style,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        stock: Number(form.stock),
        description: form.description,
        colors: split(form.colors),
        sizes: split(form.sizes),
        features: split(form.features),
        images: form.images,
        isNew: form.isNew,
        isFeatured: form.isFeatured,
        isBestseller: form.isBestseller,
      })
      await apiFetch(form.id ? `/api/admin/products/${form.id}` : '/api/admin/products', { method: form.id ? 'PUT' : 'POST', body })
      note(true, form.id ? 'Product updated.' : 'Product added. It is live on the store now.')
      setForm(null)
      await load(query)
    } catch (err) {
      note(false, err instanceof Error ? err.message : 'Could not save.')
    } finally {
      setBusy(false)
    }
  }

  const remove = async (row: Row) => {
    if (!window.confirm(`Remove "${row.title}" from the store?`)) return
    try {
      const data = await apiFetch<{ result: 'deleted' | 'hidden' }>(`/api/admin/products/${row.id}`, { method: 'DELETE' })
      note(true, data.result === 'hidden' ? 'This product has past orders, so it was hidden from the store instead of deleted.' : 'Product deleted.')
      await load(query)
    } catch (err) {
      note(false, err instanceof Error ? err.message : 'Could not remove.')
    }
  }

  const [demo, setDemo] = useState<{ demo: number; demoVisible: number; real: number } | null>(null)
  const loadDemo = useCallback(() => {
    apiFetch<{ demo: number; demoVisible: number; real: number }>('/api/admin/products/demo').then(setDemo).catch(() => {})
  }, [])
  useEffect(loadDemo, [loadDemo])

  const setDemoVisible = async (visible: boolean) => {
    const text = visible
      ? 'Show the sample products in the store again?'
      : 'Hide all sample products from the store? You can show them again any time. Your own products stay visible.'
    if (!window.confirm(text)) return
    try {
      setDemo(await apiFetch('/api/admin/products/demo', { method: 'POST', body: JSON.stringify({ visible }) }))
      note(true, visible ? 'Sample products are visible again.' : 'Sample products are hidden. Only your own products show in the store.')
      await load(query)
    } catch (err) {
      note(false, err instanceof Error ? err.message : 'Could not update.')
    }
  }

  const toggle = async (row: Row) => {
    await apiFetch(`/api/admin/products/${row.id}`, { method: 'PATCH', body: JSON.stringify({ active: !row.active }) })
    await load(query)
  }

  return (
    <div>
      {demo && demo.demo > 0 && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-lavender-200 bg-lavender-50 px-4 py-3 text-sm">
          <p className="min-w-0 flex-1 text-gray-700">
            <span className="font-semibold text-black">{demo.demoVisible.toLocaleString('en-US')} sample products</span> are{' '}
            {demo.demoVisible ? 'showing' : 'hidden'}. You have {demo.real} of your own. Add your real products with “Add product”, then hide the samples.
          </p>
          <button
            type="button"
            onClick={() => setDemoVisible(demo.demoVisible === 0)}
            className="h-10 shrink-0 rounded-full border border-brand px-5 font-semibold text-brand hover:bg-white"
          >
            {demo.demoVisible === 0 ? 'Show sample products' : 'Hide all sample products'}
          </button>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <label className="relative min-w-0 flex-1 sm:max-w-sm">
          <span className="sr-only">Search products</span>
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or SKU" className={`${input} mt-0 pl-9`} />
        </label>
        <button
          type="button"
          onClick={() => {
            setMessage(null)
            setForm({ ...EMPTY })
          }}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          <Plus size={16} /> Add product
        </button>
        <span className="text-sm text-gray-500">{total} products</span>
      </div>

      {message && (
        <p role="status" className={`mt-4 rounded-xl px-4 py-3 text-sm ${message.ok ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </p>
      )}

      {form && (
        <form onSubmit={save} className="mt-6 space-y-4 rounded-3xl border border-lavender-200 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">{form.id ? 'Edit product' : 'New product'}</h3>
            <button type="button" aria-label="Close form" onClick={() => setForm(null)}>
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium sm:col-span-2">
              Name
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={input} />
            </label>
            <label className="text-sm font-medium">
              Category
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className={input}>
                {CATALOG_FACETS.categories.map((c) => (
                  <option key={c} value={c}>
                    {categoryLabel(c)}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              Type
              <input list="type-options" required value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={input} />
              <datalist id="type-options">
                {CATALOG_FACETS.types.map((t) => (
                  <option key={t} value={t} />
                ))}
              </datalist>
            </label>
            <label className="text-sm font-medium">
              Style
              <select value={form.style} onChange={(e) => setForm({ ...form, style: e.target.value })} className={input}>
                {CATALOG_FACETS.styles.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-medium">
              Stock (pieces)
              <input type="number" min={0} required value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className={input} />
            </label>
            <label className="text-sm font-medium">
              Price ($)
              <input type="number" step="0.01" min={0.01} required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={input} />
            </label>
            <label className="text-sm font-medium">
              Old price ($), optional, shows a discount
              <input type="number" step="0.01" min={0} value={form.oldPrice} onChange={(e) => setForm({ ...form, oldPrice: e.target.value })} className={input} />
            </label>
            <label className="text-sm font-medium">
              Colours (comma separated)
              <input required value={form.colors} onChange={(e) => setForm({ ...form, colors: e.target.value })} className={input} />
            </label>
            <label className="text-sm font-medium">
              Sizes (comma separated)
              <input required value={form.sizes} onChange={(e) => setForm({ ...form, sizes: e.target.value })} className={input} />
            </label>
            <label className="text-sm font-medium sm:col-span-2">
              Description
              <textarea required minLength={10} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={`${input} h-auto py-2`} />
            </label>
            <label className="text-sm font-medium sm:col-span-2">
              Highlights (one per line, optional)
              <textarea rows={2} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className={`${input} h-auto py-2`} />
            </label>
          </div>

          <div>
            <p className="text-sm font-medium">Photos (first one is the main photo)</p>
            <div className="mt-2 flex flex-wrap gap-3">
              {form.images.map((url, i) => (
                <div key={url} className="relative h-24 w-24 overflow-hidden rounded-xl bg-lavender-100">
                  <Image src={url} alt="" fill sizes="96px" className="object-cover" unoptimized={url.startsWith('/api/')} />
                  <button
                    type="button"
                    aria-label="Remove photo"
                    onClick={() => setForm({ ...form, images: form.images.filter((_, j) => j !== i) })}
                    className="absolute right-1 top-1 rounded-full bg-white p-1 shadow"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              {form.images.length < 8 && (
                <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-brand-soft text-xs text-brand hover:bg-lavender-50">
                  <Upload size={18} />
                  Add photo
                  <input type="file" accept="image/*" multiple className="sr-only" disabled={busy} onChange={(e) => void upload(e.target.files)} />
                </label>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {(
              [
                ['isNew', 'Show in New Arrivals'],
                ['isBestseller', 'Show in Best Sellers'],
                ['isFeatured', 'Featured'],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2">
                <input type="checkbox" checked={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.checked })} className="h-4 w-4 accent-brand" />
                {label}
              </label>
            ))}
          </div>

          <div className="flex gap-3">
            <button type="submit" disabled={busy} className="h-11 rounded-full bg-brand px-7 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60">
              {busy ? 'Saving...' : 'Save product'}
            </button>
            <button type="button" onClick={() => setForm(null)} className="h-11 rounded-full border border-lavender-200 px-6 text-sm font-semibold">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="py-3 pr-4">Product</th>
              <th className="pr-4">Category</th>
              <th className="pr-4">Price</th>
              <th className="pr-4">Stock</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-lavender-100">
            {rows.map((row) => (
              <tr key={row.id} className={row.active ? '' : 'opacity-50'}>
                <td className="py-2.5 pr-4">
                  <div className="flex items-center gap-3">
                    <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-lavender-100">
                      {row.image && <Image src={row.image} alt="" fill sizes="48px" className="object-cover" unoptimized={row.image.startsWith('/api/')} />}
                    </span>
                    <span>
                      <span className="block font-medium">{row.title}</span>
                      <span className="text-xs text-gray-400">{row.sku}{row.active ? '' : ' · hidden'}</span>
                    </span>
                  </div>
                </td>
                <td className="pr-4">{categoryLabel(row.category)}</td>
                <td className="pr-4">${row.price.toFixed(2)}</td>
                <td className={`pr-4 ${row.stock <= 5 ? 'font-semibold text-amber-700' : ''}`}>{row.stock}</td>
                <td className="whitespace-nowrap text-right">
                  <button type="button" onClick={() => void edit(row.id)} className="mr-3 font-semibold text-brand hover:underline">
                    Edit
                  </button>
                  <button type="button" onClick={() => void toggle(row)} className="mr-3 text-gray-600 hover:underline">
                    {row.active ? 'Hide' : 'Show'}
                  </button>
                  <button type="button" onClick={() => void remove(row)} className="text-red-600 hover:underline">
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <p className="py-8 text-center text-gray-500">No products found.</p>}
      </div>
    </div>
  )
}
