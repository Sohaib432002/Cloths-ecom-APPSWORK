'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { apiFetch } from '@/lib/client/api'

function GoogleMark() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.1H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.6-.4-3.9z" />
    </svg>
  )
}

// Shown only when Google sign-in has been configured on the server.
export function SocialLogin() {
  const [enabled, setEnabled] = useState(false)
  const params = useSearchParams()

  useEffect(() => {
    apiFetch<{ auth?: { google: boolean } }>('/api/config')
      .then((config) => setEnabled(Boolean(config.auth?.google)))
      .catch(() => setEnabled(false))
  }, [])

  const failed = params.get('error') === 'google_failed'
  const next = params.get('next') || '/'

  if (!enabled && !failed) return null

  return (
    <div className="mt-6">
      {failed && (
        <p role="alert" className="mb-3 text-sm text-red-600">
          Google sign-in did not complete. Please try again or use your email and password.
        </p>
      )}
      {enabled && (
        <>
          <a
            href={`/api/auth/google?next=${encodeURIComponent(next)}`}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-lavender-300 bg-white text-sm font-semibold transition hover:bg-lavender-50"
          >
            <GoogleMark /> Continue with Google
          </a>
          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-gray-400">
            <span className="h-px flex-1 bg-lavender-200" /> or <span className="h-px flex-1 bg-lavender-200" />
          </div>
        </>
      )}
    </div>
  )
}
