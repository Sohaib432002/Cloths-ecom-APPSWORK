import { clearSessionCookie } from '@/lib/auth/session'
import { jsonOk, logEvent } from '@/lib/http'

export async function POST() {
  await clearSessionCookie()
  logEvent('auth.logout')
  return jsonOk({ ok: true })
}
