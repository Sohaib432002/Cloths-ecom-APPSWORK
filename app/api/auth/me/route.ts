import { changePassword, updateAccount } from '@/lib/auth/users'
import { getCurrentUser, setSessionCookie } from '@/lib/auth/session'
import { jsonError, jsonOk, readJson } from '@/lib/http'
import { passwordChangeSchema, profileSchema } from '@/lib/validation'

export async function GET() {
  const user = await getCurrentUser()
  return jsonOk({ user })
}

export async function PATCH(request: Request) {
  const user = await getCurrentUser()
  if (!user) return jsonError('Please sign in to continue.', 401, 'UNAUTHENTICATED')

  const body = await readJson<Record<string, unknown>>(request)
  if (body && 'currentPassword' in body) {
    const parsed = passwordChangeSchema.safeParse(body)
    if (!parsed.success) {
      return jsonError(
        'Password must be at least 8 characters and include a number and uppercase letter.',
        400
      )
    }
    try {
      await changePassword(user, parsed.data.currentPassword, parsed.data.nextPassword)
      return jsonOk({ ok: true })
    } catch (error) {
      return jsonError(error instanceof Error ? error.message : 'Unable to update password.', 400)
    }
  }

  const parsed = profileSchema.safeParse(body)
  if (!parsed.success) {
    return jsonError('Invalid profile details.', 400)
  }

  const nextUser = await updateAccount(user, parsed.data)
  await setSessionCookie(nextUser)
  return jsonOk({ user: nextUser })
}
