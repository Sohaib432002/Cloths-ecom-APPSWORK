import { NextResponse } from 'next/server'

type ErrorBody = {
  error: string
  code?: string
  details?: unknown
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status })
}

export function jsonError(message: string, status = 400, code?: string, details?: unknown) {
  const body: ErrorBody = { error: message }
  if (code) body.code = code
  if (details) body.details = details
  return NextResponse.json(body, { status })
}

export function getClientIp(request: Request) {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]?.trim() || 'unknown'
  return request.headers.get('x-real-ip') || 'unknown'
}

export async function readJson<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T
  } catch {
    return null
  }
}

export function logEvent(event: string, meta: Record<string, unknown> = {}) {
  console.info(
    JSON.stringify({
      ts: new Date().toISOString(),
      event,
      ...meta,
    })
  )
}
