import { findAccountById, toPublicUser, updateAccount } from '@/lib/auth/users'
import { consumeAccountToken } from '@/lib/auth/tokens'
import { setSessionCookie } from '@/lib/auth/session'
import { jsonError, jsonOk, readJson } from '@/lib/http'

export async function POST(request: Request) {
  const body = await readJson<{ token?: string }>(request)
  const token = body?.token
  if (!token) return jsonError('Verification token is required.', 400)

  const userId = await consumeAccountToken(token, 'verify')
  if (!userId) {
    return jsonError('This verification link is invalid or has expired.', 400, 'EXPIRED')
  }

  const account = await findAccountById(userId)
  if (!account) return jsonError('Account not found.', 404)

  const user = await updateAccount(toPublicUser(account), { emailVerified: true })
  await setSessionCookie(user)
  return jsonOk({ user })
}
