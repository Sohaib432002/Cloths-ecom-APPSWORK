import { getDb } from '@/lib/db/client'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/commerce/pricing'

export const DEFAULT_ANNOUNCEMENT = `Free shipping on orders over $${FREE_SHIPPING_THRESHOLD} · Use code WELCOME20 for 20% off your first order`

export async function getSetting(key: string) {
  const db = await getDb()
  const result = await db.execute({ sql: 'SELECT value FROM settings WHERE key = ?', args: [key] })
  return result.rows.length ? String(result.rows[0].value) : null
}

export async function setSetting(key: string, value: string) {
  const db = await getDb()
  await db.execute({
    sql: 'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    args: [key, value],
  })
}

/** Empty string means the owner switched the announcement bar off. */
export async function getAnnouncement() {
  try {
    const value = await getSetting('announcement')
    return value === null ? DEFAULT_ANNOUNCEMENT : value
  } catch {
    return DEFAULT_ANNOUNCEMENT
  }
}
