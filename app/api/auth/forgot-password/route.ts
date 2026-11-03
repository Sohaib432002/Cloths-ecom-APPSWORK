import { findAccountByEmail } from '@/lib/auth/users'
import { createAccountToken } from '@/lib/auth/tokens'
import { getAppUrl } from '@/lib/env'
import { emailLayout, emailEnabled, sendEmail } from '@/lib/notify'
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

  const generic = { message: 'If an account exists for that email, a password reset link is on its way.' }
  if (!account) return jsonOk(generic)

  const token = await createAccountToken(account.id, 'reset')
  const resetUrl = `${getAppUrl()}/reset-password?token=${token}`
  await sendEmail({
    to: account.email,
    subject: 'Reset your Véora password',
    html: emailLayout(
      'Reset your password',
      `<p style="font-size:14px;line-height:22px">We received a request to reset your password. This link works for 30 minutes.</p>
<p><a href="${resetUrl}" style="display:inline-block;background:#7c5cdc;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:700;font-size:14px">Choose a new password</a></p>
<p style="font-size:12px;color:#6b6788">If you did not ask for this, you can ignore this email.</p>`
    ),
  })

  // Only expose the link directly while developing without an email account; never in production.
  if (!emailEnabled() && process.env.NODE_ENV !== 'production') return jsonOk({ ...generic, resetUrl })
  return jsonOk(generic)
}
