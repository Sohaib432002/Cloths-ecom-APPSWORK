import { cookies } from 'next/headers'
import { SignJWT, jwtVerify, EncryptJWT, jwtDecrypt } from 'jose'
import { getAuthSecret } from '@/lib/env'
import type { SessionUser } from '@/types/product'

export const SESSION_COOKIE = 'shopco_session'
export const REGISTRY_COOKIE = 'shopco_registry'

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
  return readSessionToken(token)
}

export type StoredAccount = {
  id: string
  email: string
  name: string
  firstName: string
  lastName: string
  phone?: string
  passwordHash: string
  emailVerified: boolean
  createdAt: string
}

export async function readRegistry(): Promise<StoredAccount[]> {
  const store = await cookies()
  const token = store.get(REGISTRY_COOKIE)?.value
  if (!token) return []

  try {
    const { payload } = await jwtDecrypt(token, await secretKey())
    const accounts = payload.accounts
    return Array.isArray(accounts) ? (accounts as StoredAccount[]) : []
  } catch {
    return []
  }
}

export async function writeRegistry(accounts: StoredAccount[]) {
  const token = await new EncryptJWT({ accounts: accounts.slice(0, 20) })
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime('180d')
    .encrypt(await secretKey())

  const store = await cookies()
  store.set(REGISTRY_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 180,
  })
}

export function toPublicUser(account: StoredAccount): SessionUser {
  return {
    id: account.id,
    email: account.email,
    name: account.name,
    firstName: account.firstName,
    lastName: account.lastName,
    phone: account.phone,
    emailVerified: account.emailVerified,
  }
}
