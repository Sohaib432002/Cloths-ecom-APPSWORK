export function getAuthSecret() {
  const secret = process.env.AUTH_SECRET
  if (secret && secret.length >= 32) return secret

  if (process.env.NODE_ENV !== 'production') {
    return 'veora-local-dev-secret-change-me-32chars'
  }

  throw new Error('AUTH_SECRET must be set to a string of at least 32 characters in production.')
}

export function getHuggingFaceConfig() {
  return {
    token: process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY || '',
    model: process.env.HF_MODEL || 'meta-llama/Llama-3.1-8B-Instruct',
  }
}

export function getAnthropicConfig() {
  return {
    key: process.env.ANTHROPIC_API_KEY || '',
    model: process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5',
  }
}

export function getAppUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return 'http://localhost:3000'
}

export const env = {
  getAuthSecret,
  getHuggingFaceConfig,
  getAppUrl,
  isProd: process.env.NODE_ENV === 'production',
}
