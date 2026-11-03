import { z } from 'zod'
import { denyUnlessAdmin } from '@/lib/auth/require-admin'
import { getAnnouncement, setSetting } from '@/lib/admin/settings'
import { jsonError, jsonOk, readJson } from '@/lib/http'

export async function GET() {
  const denied = await denyUnlessAdmin()
  if (denied) return denied
  return jsonOk({ announcement: await getAnnouncement() })
}

export async function PUT(request: Request) {
  const denied = await denyUnlessAdmin()
  if (denied) return denied
  const parsed = z.object({ announcement: z.string().trim().max(160) }).safeParse(await readJson(request))
  if (!parsed.success) return jsonError('Keep the announcement under 160 characters.', 400)
  await setSetting('announcement', parsed.data.announcement)
  return jsonOk({ ok: true })
}
