import { z } from 'zod'
import { denyUnlessAdmin } from '@/lib/auth/require-admin'
import { getDb } from '@/lib/db/client'
import { jsonError, jsonOk, readJson } from '@/lib/http'

// The store ships with sample products so it never looks empty. These routes let the owner hide or show all of
// them at once while they add their own. Hiding keeps the rows, so it can always be undone.

async function counts() {
  const db = await getDb()
  const result = await db.execute(
    'SELECT COUNT(*) AS demo, COALESCE(SUM(is_active), 0) AS visible, (SELECT COUNT(*) FROM products WHERE is_demo = 0) AS real FROM products WHERE is_demo = 1',
  )
  const row = result.rows[0]
  return { demo: Number(row.demo), demoVisible: Number(row.visible), real: Number(row.real) }
}

export async function GET() {
  const denied = await denyUnlessAdmin()
  if (denied) return denied
  return jsonOk(await counts())
}

export async function POST(request: Request) {
  const denied = await denyUnlessAdmin()
  if (denied) return denied
  const parsed = z.object({ visible: z.boolean() }).safeParse(await readJson(request))
  if (!parsed.success) return jsonError('Send { "visible": true | false }.', 400)
  const db = await getDb()
  await db.execute({ sql: 'UPDATE products SET is_active = ? WHERE is_demo = 1', args: [parsed.data.visible ? 1 : 0] })
  return jsonOk(await counts())
}
