import { createAccount } from '@/lib/auth/users'
import { createAccountToken } from '@/lib/auth/tokens'
import { setSessionCookie } from '@/lib/auth/session'
import { getAppUrl } from '@/lib/env'
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
    const token = createAccountToken(user.email, 'verify')
    logEvent('auth.signup', { email: user.email })

    return jsonOk({
      user,
      verificationUrl: `${getAppUrl()}/verify-email?token=${token}`,
    })
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Unable to create account.', 409)
  }
}
