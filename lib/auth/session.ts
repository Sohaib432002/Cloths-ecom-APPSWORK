import { cookies } from 'next/headers'
import { SignJWT, jwtVerify } from 'jose'
import { getAuthSecret } from '@/lib/env'
import type { SessionUser } from '@/types/product'
import { SESSION_COOKIE } from './constants'
import { findAccountById, toPublicUser } from './users'

export { SESSION_COOKIE }

async function secretKey() {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(getAuthSecret()))
  return new Uint8Array(digest)
}

export async function createSessionToken(user: SessionUser) {
  return new SignJWT({
    email: user.email,
    name: user.name,
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone || '',
    emailVerified: user.emailVerified,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(await secretKey())
}

export async function readSessionToken(token: string): Promise<SessionUser | null> {
  try {
    const { payload } = await jwtVerify(token, await secretKey())
    if (!payload.sub || typeof payload.email !== 'string') return null

    return {
      id: payload.sub,
      email: payload.email,
      name: String(payload.name || ''),
      firstName: String(payload.firstName || ''),
      lastName: String(payload.lastName || ''),
      phone: String(payload.phone || ''),
      emailVerified: Boolean(payload.emailVerified),
    }
  } catch {
    return null
  }
}

export async function setSessionCookie(user: SessionUser) {
  const token = await createSessionToken(user)
  const store = await cookies()
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function clearSessionCookie() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const store = await cookies()
  const token = store.get(SESSION_COOKIE)?.value
  if (!token) return null
  const session = await readSessionToken(token)
  if (!session) return null
  // the database is the source of truth, so deleted accounts and profile edits take effect immediately
  const account = await findAccountById(session.id)
  return account ? toPublicUser(account) : null
}
