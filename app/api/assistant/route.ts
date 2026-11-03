import { z } from 'zod'
import { runAssistant } from '@/lib/ai/assistant'
import { getCurrentUser } from '@/lib/auth/session'
import { getClientIp, jsonError, jsonOk, readJson } from '@/lib/http'
import { rateLimit } from '@/lib/rate-limit'

const schema = z.object({
  message: z.string().trim().min(1, 'Type a message.').max(500),
  history: z
    .array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().max(1500) }))
    .max(10)
    .optional(),
})

export async function POST(request: Request) {
  const limited = rateLimit(`assistant:${getClientIp(request)}`, 30, 60_000)
  if (!limited.success) return jsonError('You are sending messages too quickly. Please wait a moment.', 429, 'RATE_LIMITED')

  const parsed = schema.safeParse(await readJson(request))
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message || 'Type a message.', 400)

  const result = await runAssistant(parsed.data, await getCurrentUser())
  // `advice` keeps the response shape compatible with the stylist chat component
  return jsonOk({ advice: result.reply, reply: result.reply, products: result.products, provider: result.provider })
}
