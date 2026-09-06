type Bucket = {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const existing = buckets.get(key)

  if (!existing || existing.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: limit - 1 }
  }

  if (existing.count >= limit) {
    return { success: false, remaining: 0, retryAfterMs: existing.resetAt - now }
  }

  existing.count += 1
  return { success: true, remaining: limit - existing.count }
}
