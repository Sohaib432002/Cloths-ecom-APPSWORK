import { randomBytes } from 'node:crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getAppUrl } from '@/lib/env'
import { googleAuthUrl, googleEnabled, OAUTH_COOKIE } from '@/lib/auth/google'

export async function GET(request: Request) {
  if (!googleEnabled()) return NextResponse.redirect(`${getAppUrl()}/login?error=google_off`)

  const next = new URL(request.url).searchParams.get('next') || '/'
  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/'
  const state = randomBytes(16).toString('hex')

  const store = await cookies()
  store.set(OAUTH_COOKIE, `${state}|${safeNext}`, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 600,
  })
  return NextResponse.redirect(googleAuthUrl(state))
}
