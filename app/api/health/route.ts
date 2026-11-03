import { jsonOk, jsonError } from '@/lib/http'
import { getHuggingFaceConfig } from '@/lib/env'
import { getDb, isEphemeralDb } from '@/lib/db/client'

export async function GET() {
  const { token, model } = getHuggingFaceConfig()
  try {
    const db = await getDb()
    const result = await db.execute('SELECT COUNT(*) AS products FROM products')
    return jsonOk({
      ok: true,
      service: 'Véora API',
      database: {
        connected: true,
        engine: process.env.TURSO_DATABASE_URL ? 'turso (libsql)' : 'sqlite',
        persistent: !isEphemeralDb(),
        products: Number(result.rows[0].products),
      },
      huggingface: {
        configured: Boolean(token),
        model,
      },
    })
  } catch (error) {
    return jsonError(error instanceof Error ? error.message : 'Database unavailable.', 503, 'DB_DOWN')
  }
}
