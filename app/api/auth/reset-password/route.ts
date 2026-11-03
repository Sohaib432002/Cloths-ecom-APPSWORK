import { findAccountById, setPassword } from '@/lib/auth/users'
import { consumeAccountToken } from '@/lib/auth/tokens'
import { jsonError, jsonOk, readJson } from '@/lib/http'
import { resetPasswordSchema } from '@/lib/validation'

export async function POST(request: Request) {
  const parsed = resetPasswordSchema.safeParse(await readJson(request))
  if (!parsed.success) {
    return jsonError('The reset link is invalid or the password does not meet requirements.', 400)
  }

  const userId = await consumeAccountToken(parsed.data.token, 'reset')
  if (!userId) {
    return jsonError('This reset link has expired. Request a new one.', 400, 'EXPIRED')
  }

  const account = await findAccountById(userId)
  if (!account) {
    return jsonError('Account not found.', 404)
  }

  await setPassword(account.id, parsed.data.password)
  return jsonOk({ ok: true })
}
