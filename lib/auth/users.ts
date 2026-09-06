import { hashPassword, verifyPassword } from './password'
import {
  readRegistry,
  toPublicUser,
  writeRegistry,
  type StoredAccount,
} from './session'
import type { SessionUser } from '@/types/product'
import { demoCredentials } from './public'

const DEMO_EMAIL = demoCredentials.email
const DEMO_PASSWORD = demoCredentials.password

let demoAccount: StoredAccount | null = null

async function getDemoAccount(): Promise<StoredAccount> {
  if (!demoAccount) {
    demoAccount = {
      id: 'usr_demo',
      email: DEMO_EMAIL,
      name: 'Alex Morgan',
      firstName: 'Alex',
      lastName: 'Morgan',
      phone: '+1 415 555 0148',
      passwordHash: await hashPassword(DEMO_PASSWORD),
      emailVerified: true,
      createdAt: '2026-01-12T10:00:00.000Z',
    }
  }
  return demoAccount
}

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  const firstName = parts[0] || 'Guest'
  const lastName = parts.slice(1).join(' ') || 'Shopper'
  return { firstName, lastName, name: `${firstName} ${lastName}`.trim() }
}

export async function findAccountByEmail(email: string) {
  const normalized = email.trim().toLowerCase()
  const demo = await getDemoAccount()
  if (demo.email === normalized) return demo
  const registry = await readRegistry()
  return registry.find((account) => account.email === normalized) || null
}

export async function authenticate(email: string, password: string) {
  const account = await findAccountByEmail(email)
  if (!account) return null
  const valid = await verifyPassword(password, account.passwordHash)
  if (!valid) return null
  return toPublicUser(account)
}

export async function createAccount(input: {
  fullName: string
  email: string
  password: string
  phone?: string
}) {
  const email = input.email.trim().toLowerCase()
  const existing = await findAccountByEmail(email)
  if (existing) {
    throw new Error('An account with this email already exists.')
  }

  const names = splitName(input.fullName)
  const account: StoredAccount = {
    id: `usr_${crypto.randomUUID()}`,
    email,
    ...names,
    phone: input.phone,
    passwordHash: await hashPassword(input.password),
    emailVerified: false,
    createdAt: new Date().toISOString(),
  }

  const registry = await readRegistry()
  await writeRegistry([...registry.filter((item) => item.email !== email), account])
  return toPublicUser(account)
}

export async function updateAccount(
  user: SessionUser,
  patch: Partial<Pick<SessionUser, 'name' | 'firstName' | 'lastName' | 'phone' | 'emailVerified'>>
) {
  const demo = await getDemoAccount()
  const nextUser: SessionUser = {
    ...user,
    ...patch,
    name:
      patch.firstName || patch.lastName
        ? `${patch.firstName || user.firstName} ${patch.lastName || user.lastName}`.trim()
        : patch.name || user.name,
  }

  if (user.id === demo.id) {
    demoAccount = {
      ...demo,
      ...nextUser,
      passwordHash: demo.passwordHash,
    }
    return nextUser
  }

  const registry = await readRegistry()
  const updated = registry.map((account) =>
    account.id === user.id
      ? {
          ...account,
          ...nextUser,
          passwordHash: account.passwordHash,
        }
      : account
  )
  await writeRegistry(updated)
  return nextUser
}

export async function changePassword(user: SessionUser, currentPassword: string, nextPassword: string) {
  const account = await findAccountByEmail(user.email)
  if (!account) throw new Error('Account not found.')
  const valid = await verifyPassword(currentPassword, account.passwordHash)
  if (!valid) throw new Error('Current password is incorrect.')

  const passwordHash = await hashPassword(nextPassword)
  if (account.id === 'usr_demo') {
    const demo = await getDemoAccount()
    demoAccount = { ...demo, passwordHash }
    return
  }

  const registry = await readRegistry()
  await writeRegistry(
    registry.map((item) => (item.id === account.id ? { ...item, passwordHash } : item))
  )
}

export { demoCredentials }
