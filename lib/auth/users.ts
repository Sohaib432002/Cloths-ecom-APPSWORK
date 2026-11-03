import { getDb } from '@/lib/db/client'
import type { SessionUser } from '@/types/product'
import { hashPassword, verifyPassword } from './password'

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

function toAccount(row: Record<string, unknown>): StoredAccount {
  const firstName = String(row.first_name)
  const lastName = String(row.last_name)
  return {
    id: String(row.id),
    email: String(row.email),
    name: `${firstName} ${lastName}`.trim(),
    firstName,
    lastName,
    phone: row.phone ? String(row.phone) : undefined,
    passwordHash: String(row.password_hash),
    emailVerified: Boolean(row.email_verified),
    createdAt: String(row.created_at),
  }
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

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  const firstName = parts[0] || 'Guest'
  const lastName = parts.slice(1).join(' ') || '-'
  return { firstName, lastName }
}

export async function findAccountByEmail(email: string) {
  const db = await getDb()
  const result = await db.execute({
    sql: 'SELECT * FROM users WHERE email = ? COLLATE NOCASE',
    args: [email.trim()],
  })
  return result.rows.length ? toAccount(result.rows[0] as unknown as Record<string, unknown>) : null
}

export async function findAccountById(id: string) {
  const db = await getDb()
  const result = await db.execute({ sql: 'SELECT * FROM users WHERE id = ?', args: [id] })
  return result.rows.length ? toAccount(result.rows[0] as unknown as Record<string, unknown>) : null
}

export async function authenticate(email: string, password: string) {
  const account = await findAccountByEmail(email)
  if (!account) return null
  const valid = await verifyPassword(password, account.passwordHash)
  return valid ? toPublicUser(account) : null
}

export async function createAccount(input: {
  fullName: string
  email: string
  password: string
  phone?: string
}) {
  const email = input.email.trim().toLowerCase()
  if (await findAccountByEmail(email)) {
    throw new Error('An account with this email already exists.')
  }

  const { firstName, lastName } = splitName(input.fullName)
  const id = `usr_${crypto.randomUUID()}`
  const db = await getDb()
  await db.execute({
    sql: `INSERT INTO users (id, email, first_name, last_name, phone, password_hash, email_verified, created_at)
          VALUES (?, ?, ?, ?, ?, ?, 0, ?)`,
    args: [id, email, firstName, lastName, input.phone || null, await hashPassword(input.password), new Date().toISOString()],
  })

  const created = await findAccountById(id)
  if (!created) throw new Error('Unable to create account.')
  return toPublicUser(created)
}

export async function updateAccount(
  user: SessionUser,
  patch: Partial<Pick<SessionUser, 'name' | 'firstName' | 'lastName' | 'phone' | 'emailVerified'>>
) {
  const db = await getDb()
  const firstName = patch.firstName ?? user.firstName
  const lastName = patch.lastName ?? user.lastName
  const phone = patch.phone ?? user.phone ?? null
  const verified = patch.emailVerified ?? user.emailVerified

  await db.execute({
    sql: 'UPDATE users SET first_name = ?, last_name = ?, phone = ?, email_verified = ? WHERE id = ?',
    args: [firstName, lastName, phone, verified ? 1 : 0, user.id],
  })

  const updated = await findAccountById(user.id)
  if (!updated) throw new Error('Account not found.')
  return toPublicUser(updated)
}

export async function setPassword(userId: string, password: string) {
  const db = await getDb()
  await db.execute({
    sql: 'UPDATE users SET password_hash = ? WHERE id = ?',
    args: [await hashPassword(password), userId],
  })
}

export async function changePassword(user: SessionUser, currentPassword: string, nextPassword: string) {
  const account = await findAccountById(user.id)
  if (!account) throw new Error('Account not found.')
  const valid = await verifyPassword(currentPassword, account.passwordHash)
  if (!valid) throw new Error('Current password is incorrect.')
  await setPassword(user.id, nextPassword)
}

