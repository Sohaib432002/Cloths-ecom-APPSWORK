import { getClientIp, jsonError, jsonOk, logEvent, readJson } from '@/lib/http'
import { rateLimit } from '@/lib/rate-limit'
import { newsletterSchema } from '@/lib/validation'

const subscribers = new Set<string>()

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
  subscribers.add(email)
  logEvent('newsletter.subscribe', { email })
  return jsonOk({
    message: 'You are on the list. Watch your inbox for early access to drops and private offers.',
  })
}
