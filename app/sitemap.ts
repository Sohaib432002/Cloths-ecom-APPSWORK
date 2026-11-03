import type { MetadataRoute } from 'next'
import { getDb } from '@/lib/db/client'
import { getAppUrl } from '@/lib/env'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getAppUrl()
  const db = await getDb()
  const products = await db.execute('SELECT slug FROM products')

  const pages = ['', '/Store', '/about', '/contact', '/help', '/track', '/stylist', '/PrivacyPolicy', '/TermsConditions']
  return [
    ...pages.map((path) => ({ url: `${base}${path}`, changeFrequency: 'weekly' as const, priority: path === '' ? 1 : 0.6 })),
    ...products.rows.map((row) => ({
      url: `${base}/ProductDetails/${row.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]
}
