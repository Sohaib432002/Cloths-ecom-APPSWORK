import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getAppUrl } from '@/lib/env'
import { logEvent } from '@/lib/http'
import { fetchGoogleProfile, findOrCreateGoogleUser, googleEnabled, OAUTH_COOKIE } from '@/lib/auth/google'
import { setSessionCookie } from '@/lib/auth/session'

export async function GET(request: Request) {
  const base = getAppUrl()
  const url = new URL(request.url)
  const store = await cookies()
  const saved = store.get(OAUTH_COOKIE)?.value || ''
  store.delete(OAUTH_COOKIE)

  const [state, next = '/'] = saved.split('|')
  const code = url.searchParams.get('code')

  // state must match the cookie set when the sign-in started, otherwise the request is rejected
  if (!googleEnabled() || !code || !state || state !== url.searchParams.get('state')) {
    return NextResponse.redirect(`${base}/login?error=google_failed`)
  }

  try {
    const profile = await fetchGoogleProfile(code)
    const user = await findOrCreateGoogleUser(profile)
    await setSessionCookie(user)
    logEvent('auth.google', { email: user.email })
    return NextResponse.redirect(`${base}${next.startsWith('/') && !next.startsWith('//') ? next : '/'}`)
  } catch (error) {
    logEvent('auth.google_failed', { reason: error instanceof Error ? error.message : 'unknown' })
    return NextResponse.redirect(`${base}/login?error=google_failed`)
  }
}
