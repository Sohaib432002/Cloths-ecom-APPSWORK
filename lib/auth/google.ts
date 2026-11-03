import { randomBytes } from 'node:crypto'
import { getAppUrl } from '@/lib/env'
import { getDb } from '@/lib/db/client'
import { findAccountByEmail, toPublicUser } from './users'

export const OAUTH_COOKIE = 'veora_oauth'

export function googleEnabled() {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
}

export const googleRedirectUri = () => `${getAppUrl()}/api/auth/google/callback`

export function googleAuthUrl(state: string) {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: googleRedirectUri(),
    response_type: 'code',
    scope: 'openid email profile',
    state,
    prompt: 'select_account',
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`
}

type GoogleProfile = { email: string; email_verified: boolean; given_name?: string; family_name?: string; name?: string }

export async function fetchGoogleProfile(code: string): Promise<GoogleProfile> {
  const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: googleRedirectUri(),
      grant_type: 'authorization_code',
    }),
  })
  const tokens = await tokenResponse.json()
  if (!tokenResponse.ok || !tokens.access_token) throw new Error('Google sign-in failed.')

  const profileResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })
  if (!profileResponse.ok) throw new Error('Could not read your Google profile.')
  return profileResponse.json()
}

/** Signs in the existing account with this email, or creates one (Google has already verified the address). */
export async function findOrCreateGoogleUser(profile: GoogleProfile) {
  if (!profile.email || !profile.email_verified) throw new Error('Your Google email is not verified.')
  const existing = await findAccountByEmail(profile.email)
  if (existing) {
    if (!existing.emailVerified) {
      const db = await getDb()
      await db.execute({ sql: 'UPDATE users SET email_verified = 1 WHERE id = ?', args: [existing.id] })
      existing.emailVerified = true
    }
    return toPublicUser(existing)
  }

  const db = await getDb()
  const id = `usr_${crypto.randomUUID()}`
  const fullName = profile.name || profile.email.split('@')[0]
  const firstName = profile.given_name || fullName.split(' ')[0] || 'Guest'
  const lastName = profile.family_name || fullName.split(' ').slice(1).join(' ') || '-'
  // no usable password: Google accounts sign in through Google (or reset a password by email)
  const { hashPassword } = await import('./password')
  await db.execute({
    sql: `INSERT INTO users (id, email, first_name, last_name, password_hash, email_verified, created_at)
          VALUES (?, ?, ?, ?, ?, 1, ?)`,
    args: [id, profile.email.toLowerCase(), firstName, lastName, await hashPassword(randomBytes(24).toString('hex')), new Date().toISOString()],
  })
  const created = await findAccountByEmail(profile.email)
  return toPublicUser(created!)
}
