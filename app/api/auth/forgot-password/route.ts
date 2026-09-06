import { findAccountByEmail } from '@/lib/auth/users'
import { createAccountToken } from '@/lib/auth/tokens'
import { getAppUrl } from '@/lib/env'
import { getClientIp, jsonError, jsonOk, logEvent, readJson } from '@/lib/http'
import { rateLimit } from '@/lib/rate-limit'
import { forgotPasswordSchema } from '@/lib/validation'

export async function POST(request: Request) {
  const limited = rateLimit(`forgot:${getClientIp(request)}`, 6, 60_000)
  if (!limited.success) {
    return jsonError('Too many requests. Try again shortly.', 429, 'RATE_LIMITED')
  }

  const parsed = forgotPasswordSchema.safeParse(await readJson(request))
  if (!parsed.success) {
    return jsonError('Enter a valid email address.', 400)
  }

  const account = await findAccountByEmail(parsed.data.email)
  logEvent('auth.forgot_password', { email: parsed.data.email, found: Boolean(account) })

  if (!account) {
    return jsonOk({
      message: 'If an account exists for that email, a reset link is ready.',
    })
  }

  const token = createAccountToken(account.email, 'reset')
  return jsonOk({
    message: 'Password reset link created. Email delivery is not configured in this demo, so the link is returned directly.',
    resetUrl: `${getAppUrl()}/reset-password?token=${token}`,
  })
}
