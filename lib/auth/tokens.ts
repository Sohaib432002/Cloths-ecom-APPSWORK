import { getDb } from '@/lib/db/client'

type TokenType = 'reset' | 'verify'

export async function createAccountToken(userId: string, type: TokenType, ttlMs = 1000 * 60 * 30) {
  const db = await getDb()
  const token = crypto.randomUUID().replace(/-/g, '')
  await db.batch(
    [
      { sql: 'DELETE FROM auth_tokens WHERE expires_at < ?', args: [Date.now()] },
      {
        sql: 'INSERT INTO auth_tokens (token, user_id, type, expires_at) VALUES (?, ?, ?, ?)',
        args: [token, userId, type, Date.now() + ttlMs],
      },
    ],
    'write'
  )
  return token
}

/** Returns the owning user id and deletes the token, or null when it is unknown, wrong-typed or expired. */
export async function consumeAccountToken(token: string, type: TokenType) {
  const db = await getDb()
  const result = await db.execute({
    sql: 'DELETE FROM auth_tokens WHERE token = ? AND type = ? AND expires_at >= ? RETURNING user_id',
    args: [token, type, Date.now()],
  })
  return result.rows.length ? String(result.rows[0].user_id) : null
}
