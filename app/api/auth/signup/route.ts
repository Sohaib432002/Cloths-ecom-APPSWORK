import { createAccount } from '@/lib/auth/users'
import { createAccountToken } from '@/lib/auth/tokens'
import { setSessionCookie } from '@/lib/auth/session'
import { getAppUrl } from '@/lib/env'
import { emailLayout, emailEnabled, sendEmail } from '@/lib/notify'
import { getClientIp, jsonError, jsonOk, logEvent, readJson } from '@/lib/http'
import { rateLimit } from '@/lib/rate-limit'
import { signupSchema } from '@/lib/validation'

export async function POST(request: Request) {
  const limited = rateLimit(`signup:${getClientIp(request)}`, 8, 60_000)
  if (!limited.success) {
    return jsonError('Too many signup attempts. Try again shortly.', 429, 'RATE_LIMITED')
  }

  const body = await readJson<unknown>(request)
  const parsed = signupSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message || 'Invalid signup details.', 400, 'VALIDATION')
  }

  try {
    const user = await createAccount(parsed.data)
    await setSessionCookie(user)
    const token = await createAccountToken(user.id, 'verify')
    logEvent('auth.signup', { email: user.email })

    const verificationUrl = `${getAppUrl()}/verify-email?token=${token}`
    await sendEmail({
      to: user.email,
      subject: 'Welcome to Véora, please verify your email',
      html: emailLayout(
        `Welcome, ${user.firstName}`,
        `<p style="font-size:14px;line-height:22px">Thanks for joining Véora. Confirm your email address to finish setting up your account. Use code <strong>WELCOME20</strong> for 20% off your first order over $40.</p>
<p><a href="${verificationUrl}" style="display:inline-block;background:#7c5cdc;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:700;font-size:14px">Verify email</a></p>`
      ),
    })

    return jsonOk({
      user,
      ...(!emailEnabled() && process.env.NODE_ENV !== 'production' ? { verificationUrl } : {}),
    })
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Unable to create account.', 409)
  }
}
