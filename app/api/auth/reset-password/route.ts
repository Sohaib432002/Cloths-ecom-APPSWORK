import { findAccountByEmail } from '@/lib/auth/users'
import { consumeAccountToken } from '@/lib/auth/tokens'
import { hashPassword } from '@/lib/auth/password'
import { readRegistry, writeRegistry } from '@/lib/auth/session'
import { jsonError, jsonOk, readJson } from '@/lib/http'
import { resetPasswordSchema } from '@/lib/validation'

export async function POST(request: Request) {
  const parsed = resetPasswordSchema.safeParse(await readJson(request))
  if (!parsed.success) {
    return jsonError('The reset link is invalid or the password does not meet requirements.', 400)
  }

  const email = consumeAccountToken(parsed.data.token, 'reset')
  if (!email) {
    return jsonError('This reset link has expired. Request a new one.', 400, 'EXPIRED')
  }

  const account = await findAccountByEmail(email)
  if (!account) {
    return jsonError('Account not found.', 404)
  }

  const passwordHash = await hashPassword(parsed.data.password)
  if (account.id === 'usr_demo') {
    return jsonError('The demo account password cannot be changed from this screen. Use ShopCo123! to sign in.', 400)
  }

  const registry = await readRegistry()
  await writeRegistry(registry.map((item) => (item.email === email ? { ...item, passwordHash } : item)))
  return jsonOk({ ok: true })
}
