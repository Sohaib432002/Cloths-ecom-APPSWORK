'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Menu, Search, Heart, ShoppingBag, User, Bell, Sparkles, X, ChevronDown } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCart } from '@/hooks/usecart'
import { useWishlist } from '@/context/wishlistContext'
import { useNotification } from '@/context/NotificationContext'
import { useAuth } from '@/context/AuthContext'
import { CATALOG_FACETS, categoryLabel } from '@/lib/catalog/facets'
import { cartQuantity } from '@/lib/commerce/pricing'
import type { Product } from '@/types/product'
import Logo from './Logo'

const shopLinks = CATALOG_FACETS.categories.map((category) => ({
  label: categoryLabel(category),
  href: `/Store?category=${encodeURIComponent(category)}`,
}))

const mainLinks = [
  { label: 'Home', href: '/' },
  { label: 'New Arrivals', href: '/Store?arrival=true' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState<Product[]>([])
  const [shopOpen, setShopOpen] = useState(false)
  const searchInput = useRef<HTMLInputElement>(null)
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
    setSearchOpen(false)
    setShopOpen(false)
    closeNotifications()
    setSuggestions([])
  }, [pathname, searchParams, closeNotifications])

  useEffect(() => {
    if (searchOpen) searchInput.current?.focus()
  }, [searchOpen])

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault()
    if (!search.trim()) return
    router.push(`/Store?search=${encodeURIComponent(search.trim())}`)
    setSuggestions([])
    setSearchOpen(false)
  }

  const isActive = (href: string) => (href === '/' ? pathname === '/' : href.startsWith(pathname) && pathname !== '/')
  const iconButton =
    'relative flex h-10 w-10 items-center justify-center rounded-full text-black transition hover:bg-lavender-100'
  const badge =
    'absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white'

  return (
    <header className="sticky top-0 z-50 border-b border-lavender-200/60 bg-white/90 backdrop-blur-md">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <div className="mx-auto flex h-[68px] max-w-310 items-center gap-6 px-4 lg:px-6">
        <button
          type="button"
          className={`${iconButton} -ml-2 lg:hidden`}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={22} />
        </button>

        <Logo />

        <nav className="hidden flex-1 items-center justify-center gap-9 text-[13px] font-medium lg:flex" aria-label="Primary">
          <Link href="/" className={isActive('/') ? 'text-brand' : 'hover:text-brand'}>
            Home
          </Link>
          <div className="relative" onMouseLeave={() => setShopOpen(false)}>
            <button
              type="button"
              aria-expanded={shopOpen}
              onClick={() => setShopOpen((open) => !open)}
              onMouseEnter={() => setShopOpen(true)}
              className={`flex items-center gap-1 ${pathname === '/Store' ? 'text-brand' : 'hover:text-brand'}`}
            >
              Shop <ChevronDown size={14} />
            </button>
            {shopOpen && (
              <div className="absolute left-1/2 top-full z-20 -translate-x-1/2 pt-3">
                <div className="grid w-56 gap-0.5 rounded-2xl border border-lavender-200 bg-white p-2 shadow-xl">
                  <Link href="/Store" className="rounded-lg px-3 py-2 hover:bg-lavender-100">
                    All products
                  </Link>
                  {shopLinks.map((link) => (
                    <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 hover:bg-lavender-100">
                      {link.label}
                    </Link>
                  ))}
                  <Link href="/Store?sale=true" className="rounded-lg px-3 py-2 text-brand hover:bg-lavender-100">
                    Sale
                  </Link>
                </div>
              </div>
            )}
          </div>
          {mainLinks.slice(1).map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-brand">
              {link.label}
            </Link>
          ))}
          <Link href="/stylist" className="inline-flex items-center gap-1 hover:text-brand">
            <Sparkles size={14} />
            Stylist
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-0.5 sm:gap-1 lg:ml-0">
          <button
            type="button"
            className={iconButton}
            aria-label="Search products"
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((open) => !open)}
          >
            <Search size={19} />
          </button>
          <Link href="/wishlist" className={iconButton} aria-label={`Wishlist, ${wishlist.length} saved`}>
            <Heart size={19} />
            {wishlist.length > 0 && <span className={badge}>{wishlist.length}</span>}
          </Link>
          <Link href="/cart" className={iconButton} aria-label={`Bag, ${qty} items`}>
            <ShoppingBag size={19} />
            {qty > 0 && <span className={badge}>{qty}</span>}
          </Link>
          {user && (
            <div className="relative">
              <button type="button" aria-label="Notifications" onClick={toggleNotifications} className={iconButton}>
                <Bell size={19} />
                {unreadCount > 0 && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand" />}
              </button>
              {isOpen && (
                <div className="absolute right-0 z-30 mt-2 w-80 max-w-[85vw] rounded-2xl border border-lavender-200 bg-white p-3 shadow-xl">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-semibold">Notifications</p>
                    <button type="button" className="text-xs text-brand" onClick={markAllRead}>
                      Mark all read
                    </button>
                  </div>
                  <div className="space-y-2">
                    {notifications.length === 0 && <p className="px-1 py-3 text-sm text-gray-500">You are all caught up.</p>}
                    {notifications.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        className={`block rounded-xl px-3 py-2 text-sm ${item.read ? 'bg-white' : 'bg-lavender-50'}`}
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
              <summary className={`${iconButton} cursor-pointer list-none`} aria-label="Account menu">
                <User size={19} />
              </summary>
              <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-lavender-200 bg-white p-2 shadow-xl">
                <p className="truncate px-3 py-2 text-xs text-gray-500">Hi, {user.firstName}</p>
                <Link href="/account/profile?Tab=Dashboard" className="block rounded-lg px-3 py-2 text-sm hover:bg-lavender-100">
                  Account
                </Link>
                <Link href="/account/profile?Tab=Orders" className="block rounded-lg px-3 py-2 text-sm hover:bg-lavender-100">
                  Orders
                </Link>
                <button
                  type="button"
                  onClick={() => logout().then(() => router.push('/'))}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-lavender-100"
                >
                  Sign out
                </button>
              </div>
            </details>
          ) : (
            <Link
              href="/login"
              className="ml-1 hidden rounded-full bg-brand px-5 py-2 text-[13px] font-semibold text-white transition hover:bg-brand-dark sm:inline-block"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-lavender-200/60 bg-white">
          <div className="relative mx-auto max-w-2xl px-4 py-3">
            <form onSubmit={submitSearch} className="flex items-center rounded-full bg-lavender-100 px-4 py-2.5">
              <Search size={16} className="text-brand" />
              <label htmlFor="site-search" className="sr-only">
                Search products
              </label>
              <input
                id="site-search"
                ref={searchInput}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search hoodies, sneakers, caps..."
                className="ml-3 w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
              <button type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}>
                <X size={16} className="text-gray-500" />
              </button>
            </form>
            {suggestions.length > 0 && (
              <div className="absolute left-4 right-4 z-30 mt-2 overflow-hidden rounded-2xl border border-lavender-200 bg-white shadow-xl">
                {suggestions.map((item) => (
                  <Link
                    key={item.id}
                    href={`/ProductDetails/${item.slug}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-lavender-50"
                  >
                    <span className="line-clamp-1">{item.title}</span>
                    <span className="font-semibold text-brand">${item.price}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-indigo-deeper/40 lg:hidden" onClick={() => setMenuOpen(false)}>
          <div
            className="h-full w-80 max-w-[85vw] overflow-y-auto bg-white p-5 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <Logo />
              <button type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
                <X />
              </button>
            </div>
            <form onSubmit={submitSearch} className="mb-6 flex items-center rounded-full bg-lavender-100 px-4 py-3">
              <Search size={16} className="text-brand" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search"
                aria-label="Search products"
                className="ml-3 w-full bg-transparent outline-none"
              />
            </form>
            <div className="flex flex-col gap-1 text-sm font-medium">
              {mainLinks.slice(0, 2).map((link) => (
                <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2.5 hover:bg-lavender-100">
                  {link.label}
                </Link>
              ))}
              <p className="eyebrow mt-4 px-3">Shop</p>
              {shopLinks.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2.5 hover:bg-lavender-100">
                  {link.label}
                </Link>
              ))}
              <Link href="/Store?sale=true" className="rounded-lg px-3 py-2.5 text-brand hover:bg-lavender-100">
                Sale
              </Link>
              <p className="eyebrow mt-4 px-3">Explore</p>
              <Link href="/stylist" className="rounded-lg px-3 py-2.5 hover:bg-lavender-100">
                AI Stylist
              </Link>
              {mainLinks.slice(2).map((link) => (
                <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2.5 hover:bg-lavender-100">
                  {link.label}
                </Link>
              ))}
              {!user && (
                <Link
                  href="/login"
                  className="mt-4 rounded-full bg-brand px-4 py-3 text-center font-semibold text-white"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
