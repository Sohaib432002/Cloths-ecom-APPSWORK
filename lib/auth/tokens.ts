type TokenRecord = {
  email: string
  type: 'reset' | 'verify'
  expiresAt: number
}

const tokens = new Map<string, TokenRecord>()

export function createAccountToken(email: string, type: TokenRecord['type'], ttlMs = 1000 * 60 * 30) {
  const token = crypto.randomUUID().replace(/-/g, '')
  tokens.set(token, {
    email: email.trim().toLowerCase(),
    type,
    expiresAt: Date.now() + ttlMs,
  })
  return token
}

export function consumeAccountToken(token: string, type: TokenRecord['type']) {
  const record = tokens.get(token)
  if (!record || record.type !== type || record.expiresAt < Date.now()) {
    return null
  }
  tokens.delete(token)
  return record.email
}
