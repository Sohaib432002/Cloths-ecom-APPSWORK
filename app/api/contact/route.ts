import { getDb } from '@/lib/db/client'
import { getClientIp, jsonError, jsonOk, logEvent, readJson } from '@/lib/http'
import { rateLimit } from '@/lib/rate-limit'
import { emailLayout, escapeHtml, sendEmail } from '@/lib/notify'
import { SITE } from '@/lib/site'
import { contactSchema } from '@/lib/validation'

export async function POST(request: Request) {
  const limited = rateLimit(`contact:${getClientIp(request)}`, 6, 60_000)
  if (!limited.success) {
    return jsonError('Too many messages. Please wait a moment.', 429, 'RATE_LIMITED')
  }

  const parsed = contactSchema.safeParse(await readJson(request))
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message || 'Please complete the form.', 400)
  }

  const { name, email, subject, message } = parsed.data
  const db = await getDb()
  await db.execute({
    sql: 'INSERT INTO contact_messages (name, email, subject, message, created_at) VALUES (?, ?, ?, ?, ?)',
    args: [name, email, subject, message, new Date().toISOString()],
  })
  logEvent('contact.received', { email, subject })

  await sendEmail({
    to: SITE.email,
    replyTo: email,
    subject: `Website message: ${subject}`,
    html: emailLayout(
      subject,
      `<p style="font-size:14px;line-height:22px"><strong>${escapeHtml(name)}</strong> (${escapeHtml(email)})</p>
<p style="font-size:14px;line-height:22px;white-space:pre-wrap">${escapeHtml(message)}</p>`
    ),
  })

  return jsonOk({
    message: 'Thanks for writing in. A Véora specialist will reply within one business day.',
  })
}
