'use client'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-3xl font-black">Something went wrong</h1>
      <p className="mt-3 text-gray-500">Please try again. If the issue continues, return to the catalog.</p>
      <button type="button" onClick={reset} className="mt-6 rounded-full bg-brand px-6 py-3 text-white">
        Try again
      </button>
    </div>
  )
}
