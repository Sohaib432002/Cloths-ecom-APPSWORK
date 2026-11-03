import { z } from 'zod'
import { denyUnlessAdmin } from '@/lib/auth/require-admin'
import { getDb } from '@/lib/db/client'
import { jsonError, jsonOk, readJson } from '@/lib/http'
import { emailEnabled, emailLayout, escapeHtml, sendEmail } from '@/lib/notify'

const schema = z.object({
  subject: z.string().trim().min(3).max(120),
  message: z.string().trim().min(10).max(2000),
  couponCode: z.string().trim().toUpperCase().max(20).optional(),
})

// Sends one email to every newsletter subscriber (up to 200 per send, to stay within Gmail's daily limit).
export async function POST(request: Request) {
  const denied = await denyUnlessAdmin()
  if (denied) return denied
  if (!emailEnabled()) return jsonError('Email is not configured yet (SMTP settings missing).', 503)

  const parsed = schema.safeParse(await readJson(request))
  if (!parsed.success) return jsonError('Write a subject and a message of at least 10 characters.', 400)
  const { subject, message, couponCode } = parsed.data

  const db = await getDb()
  const subscribers = await db.execute('SELECT email FROM newsletter_subscribers ORDER BY created_at DESC LIMIT 200')
  const body =
    `<p style="font-size:14px;line-height:22px;white-space:pre-wrap">${escapeHtml(message)}</p>` +
    (couponCode
      ? `<p style="margin:20px 0;padding:14px;background:#f1ecff;border-radius:12px;font-size:16px;text-align:center">Use code <strong>${escapeHtml(couponCode)}</strong> at checkout</p>`
      : '')

  let sent = 0
  for (const row of subscribers.rows) {
    if (await sendEmail({ to: String(row.email), subject, html: emailLayout(subject, body) })) sent += 1
  }
  return jsonOk({ sent, total: subscribers.rows.length })
}
