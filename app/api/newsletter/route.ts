import { getDb } from '@/lib/db/client'
import { getClientIp, jsonError, jsonOk, logEvent, readJson } from '@/lib/http'
import { rateLimit } from '@/lib/rate-limit'
import { newsletterSchema } from '@/lib/validation'

export async function POST(request: Request) {
  const limited = rateLimit(`newsletter:${getClientIp(request)}`, 8, 60_000)
  if (!limited.success) {
    return jsonError('Too many attempts. Try again shortly.', 429, 'RATE_LIMITED')
  }

  const parsed = newsletterSchema.safeParse(await readJson(request))
  if (!parsed.success) {
    return jsonError('Enter a valid email address.', 400)
  }

  const email = parsed.data.email.trim().toLowerCase()
  const db = await getDb()
  const result = await db.execute({
    sql: 'INSERT OR IGNORE INTO newsletter_subscribers (email, created_at) VALUES (?, ?)',
    args: [email, new Date().toISOString()],
  })
  logEvent('newsletter.subscribe', { email, isNew: result.rowsAffected > 0 })

  return jsonOk({
    message:
      result.rowsAffected > 0
        ? 'You are on the list. Watch your inbox for new drops and private offers.'
        : 'You are already subscribed. Thanks for staying with us.',
  })
}
