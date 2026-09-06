import { runStylist } from '@/lib/ai/stylist'
import { getClientIp, jsonError, jsonOk, logEvent, readJson } from '@/lib/http'
import { rateLimit } from '@/lib/rate-limit'
import { stylistSchema } from '@/lib/validation'

export async function POST(request: Request) {
  const limited = rateLimit(`stylist:${getClientIp(request)}`, 12, 60_000)
  if (!limited.success) {
    return jsonError('The stylist is busy. Please wait a moment and try again.', 429, 'RATE_LIMITED')
  }

  const parsed = stylistSchema.safeParse(await readJson(request))
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message || 'Tell the stylist what you need.', 400)
  }

  const result = await runStylist(parsed.data)
  logEvent('stylist.complete', {
    provider: result.provider,
    productCount: result.products.length,
  })
  return jsonOk(result)
}
