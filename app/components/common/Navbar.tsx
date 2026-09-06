'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Menu, Search, Heart, ShoppingBag, User, Bell, Sparkles, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCart } from '@/hooks/usecart'
import { useWishlist } from '@/context/wishlistContext'
import { useNotification } from '@/context/NotificationContext'
import { useAuth } from '@/context/AuthContext'
import { CATALOG_FACETS } from '@/lib/catalog/facets'
import { cartQuantity } from '@/lib/commerce/pricing'
import type { Product } from '@/types/product'

const shopLinks = [
  { label: 'New Arrivals', href: '/Store?arrival=true' },
  { label: 'Sale', href: '/Store?sale=true' },
  ...CATALOG_FACETS.categories.map((category) => ({
    label: category,
    href: `/Store?category=${encodeURIComponent(category)}`,
  })),
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [bannerOpen, setBannerOpen] = useState(true)
  const searchRef = useRef<HTMLDivElement>(null)
  const { cart } = useCart()
  const { wishlist } = useWishlist()
  const { user, logout } = useAuth()
  const { isOpen, unreadCount, notifications, toggleNotifications, closeNotifications, markAllRead } =
    useNotification()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const qty = useMemo(() => cartQuantity(cart), [cart])

  useEffect(() => {
    const value = search.trim()
    if (value.length < 2) {
      setSuggestions([])
      return
    }

    const controller = new AbortController()
    const timer = setTimeout(() => {
      fetch(`/api/products?search=${encodeURIComponent(value)}&limit=6`, { signal: controller.signal })
        .then((res) => res.json())
        .then((data) => setSuggestions(data.products || []))
        .catch(() => {})
    }, 220)

    return () => {
      controller.abort()
      clearTimeout(timer)
    }
  }, [search])

  useEffect(() => {
    setMenuOpen(false)
    closeNotifications()
    setSuggestions([])
  }, [pathname, searchParams, closeNotifications])

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault()
    if (!search.trim()) return
    router.push(`/Store?search=${encodeURIComponent(search.trim())}`)
    setSuggestions([])
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 shadow-sm backdrop-blur">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-black focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      {!user && bannerOpen && (
        <div className="relative bg-black px-4 py-2.5 text-center text-xs text-white sm:text-sm">
          Sign up today and get <strong>20% off</strong> your first order with code{' '}
          <span className="font-semibold">WELCOME20</span>.
          <Link href="/signup" className="ml-2 font-semibold underline underline-offset-4">
            Create account
          </Link>
          <button
            type="button"
            aria-label="Dismiss offer banner"
            onClick={() => setBannerOpen(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 hover:bg-white/10"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="mx-auto flex max-w-310 items-center gap-4 px-4 py-3 lg:px-6">
        <button
          type="button"
          className="rounded-lg p-2 lg:hidden"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <Menu />
        </button>

        <Link href="/" className="text-2xl font-black tracking-tight sm:text-3xl">
          SHOP.CO
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium lg:flex" aria-label="Primary">
          <details className="group relative">
            <summary className="flex cursor-pointer list-none items-center gap-1">
              Shop
            </summary>
            <div className="absolute left-0 top-full z-20 mt-3 grid w-72 gap-1 rounded-2xl border bg-white p-3 shadow-xl">
              {shopLinks.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 hover:bg-gray-50">
                  {link.label}
                </Link>
              ))}
            </div>
          </details>
          {CATALOG_FACETS.styles.map((style) => (
            <Link key={style} href={`/Store?style=${style}`} className="hover:text-gray-600">
              {style}
            </Link>
          ))}
          <Link href="/stylist" className="inline-flex items-center gap-1 font-semibold">
            <Sparkles size={16} />
            Stylist
          </Link>
        </nav>

        <div className="relative ml-auto hidden flex-1 md:block md:max-w-md" ref={searchRef}>
          <form onSubmit={submitSearch} className="flex items-center rounded-full bg-gray-100 px-4 py-2.5">
            <Search size={16} className="text-gray-500" />
            <label htmlFor="site-search" className="sr-only">
              Search products
            </label>
            <input
              id="site-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search for jeans, hoodies, formal looks..."
              className="ml-3 w-full bg-transparent text-sm outline-none"
            />
          </form>
          {suggestions.length > 0 && (
            <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border bg-white shadow-xl">
              {suggestions.map((item) => (
                <Link
                  key={item.id}
                  href={`/ProductDetails/${item.slug}`}
                  className="flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-50"
                >
                  <span>{item.title}</span>
                  <span className="font-semibold">${item.price}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2 md:ml-4">
          <Link href="/stylist" className="rounded-full p-2 hover:bg-gray-100" aria-label="Open AI stylist">
            <Sparkles size={20} />
          </Link>
          <Link href="/wishlist" className="relative rounded-full p-2 hover:bg-gray-100" aria-label="Wishlist">
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] text-white">
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link href="/cart" className="relative rounded-full p-2 hover:bg-gray-100" aria-label="Cart">
            <ShoppingBag size={20} />
            {qty > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] text-white">
                {qty}
              </span>
            )}
          </Link>
          {user && (
            <div className="relative">
              <button
                type="button"
                aria-label="Notifications"
                onClick={toggleNotifications}
                className="relative rounded-full p-2 hover:bg-gray-100"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-red-500" />
                )}
              </button>
              {isOpen && (
                <div className="absolute right-0 z-30 mt-2 w-80 rounded-2xl border bg-white p-3 shadow-xl">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-semibold">Notifications</p>
                    <button type="button" className="text-xs text-gray-500" onClick={markAllRead}>
                      Mark all read
                    </button>
                  </div>
                  <div className="space-y-2">
                    {notifications.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={`block rounded-xl px-3 py-2 text-sm ${item.read ? 'bg-white' : 'bg-gray-50'}`}
                      >
                        <p className="font-medium">{item.title}</p>
                        <p className="text-xs text-gray-500">{item.body}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {user ? (
            <details className="relative">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-full p-2 hover:bg-gray-100">
                <User size={20} />
                <span className="hidden text-sm font-medium sm:inline">{user.firstName}</span>
              </summary>
              <div className="absolute right-0 mt-2 w-48 rounded-2xl border bg-white p-2 shadow-xl">
                <Link href="/account/profile?Tab=Dashboard" className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
                  Account
                </Link>
                <Link href="/account/profile?Tab=Orders" className="block rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
                  Orders
                </Link>
                <button
                  type="button"
                  onClick={() => logout().then(() => router.push('/'))}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50"
                >
                  Sign out
                </button>
              </div>
            </details>
          ) : (
            <Link href="/login" className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">
              Sign in
            </Link>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden" onClick={() => setMenuOpen(false)}>
          <div
            className="h-full w-80 max-w-[85vw] bg-white p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <p className="text-xl font-black">SHOP.CO</p>
              <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
                <X />
              </button>
            </div>
            <form onSubmit={submitSearch} className="mb-6 flex items-center rounded-full bg-gray-100 px-4 py-3">
              <Search size={16} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search"
                className="ml-3 w-full bg-transparent outline-none"
              />
            </form>
            <div className="flex flex-col gap-2 text-sm font-medium">
              {shopLinks.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-lg px-2 py-2 hover:bg-gray-50">
                  {link.label}
                </Link>
              ))}
              <Link href="/stylist" className="rounded-lg px-2 py-2 hover:bg-gray-50">
                AI Stylist
              </Link>
              <Link href="/about" className="rounded-lg px-2 py-2 hover:bg-gray-50">
                About
              </Link>
              <Link href="/contact" className="rounded-lg px-2 py-2 hover:bg-gray-50">
                Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
