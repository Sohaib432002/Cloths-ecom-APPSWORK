import { authenticate } from '@/lib/auth/users'
import { demoCredentials } from '@/lib/auth/public'
import { setSessionCookie } from '@/lib/auth/session'
import { getClientIp, jsonError, jsonOk, logEvent, readJson } from '@/lib/http'
import { rateLimit } from '@/lib/rate-limit'
import { loginSchema } from '@/lib/validation'

export async function POST(request: Request) {
  const limited = rateLimit(`login:${getClientIp(request)}`, 10, 60_000)
  if (!limited.success) {
    return jsonError('Too many login attempts. Try again shortly.', 429, 'RATE_LIMITED')
  }

  const body = await readJson<unknown>(request)
  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError('Invalid login details.', 400, 'VALIDATION', parsed.error.flatten())
  }

  const user = await authenticate(parsed.data.email, parsed.data.password)
  if (!user) {
    return jsonError('Email or password is incorrect.', 401, 'INVALID_CREDENTIALS')
  }

  await setSessionCookie(user)
  logEvent('auth.login', { email: user.email })
  return jsonOk({ user, demo: parsed.data.email === demoCredentials.email })
}
