import { getClientIp, jsonError, jsonOk, logEvent, readJson } from '@/lib/http'
import { rateLimit } from '@/lib/rate-limit'
import { contactSchema } from '@/lib/validation'

const messages: Array<Record<string, string>> = []

export async function POST(request: Request) {
  const limited = rateLimit(`contact:${getClientIp(request)}`, 6, 60_000)
  if (!limited.success) {
    return jsonError('Too many messages. Please wait a moment.', 429, 'RATE_LIMITED')
  }

  const parsed = contactSchema.safeParse(await readJson(request))
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message || 'Please complete the form.', 400)
  }

  messages.push({ ...parsed.data, receivedAt: new Date().toISOString() })
  logEvent('contact.received', { email: parsed.data.email, subject: parsed.data.subject })
  return jsonOk({
    message: 'Thanks for writing in. A SHOP.CO specialist will reply within one business day.',
  })
}
