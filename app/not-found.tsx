import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-3xl font-black">Page not found</h1>
      <p className="mt-3 text-gray-500">The page you requested is not part of the SHOP.CO storefront.</p>
      <Link href="/" className="mt-6 inline-block rounded-full bg-black px-6 py-3 text-white">
        Back home
      </Link>
    </div>
  )
}
