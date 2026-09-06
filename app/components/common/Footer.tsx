'use client'

import { useState } from 'react'
import Link from 'next/link'
import { apiFetch } from '@/lib/client/api'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const subscribe = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setStatus('')
    try {
      const data = await apiFetch<{ message: string }>('/api/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
      setStatus(data.message)
      setEmail('')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to subscribe right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="mt-24 bg-[#F0F0F0]">
      <section className="mx-4 -translate-y-10 rounded-3xl bg-black px-5 py-8 text-white sm:mx-6 sm:px-8 lg:mx-auto lg:max-w-310 lg:px-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="max-w-xl text-2xl font-extrabold leading-tight sm:text-4xl">
            Stay up to date about our latest offers
          </h2>
          <form onSubmit={subscribe} className="w-full max-w-md space-y-3">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter your email address"
              className="w-full rounded-full bg-white px-5 py-3 text-black outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-white py-3 font-semibold text-black hover:bg-gray-200 disabled:opacity-70"
            >
              {loading ? 'Subscribing...' : 'Subscribe to Newsletter'}
            </button>
            {status && <p className="text-sm text-gray-300">{status}</p>}
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="text-3xl font-black">
              SHOP.CO
            </Link>
            <p className="mt-4 max-w-md text-sm leading-7 text-gray-500">
              Clothes that suit your style, from everyday denim to event-ready tailoring. Discover
              curated fashion for men, women, and kids with an in-house AI stylist.
            </p>
          </div>
          {[
            {
              title: 'Company',
              links: [
                { href: '/about', label: 'About' },
                { href: '/contact', label: 'Contact' },
                { href: '/stylist', label: 'AI Stylist' },
              ],
            },
            {
              title: 'Help',
              links: [
                { href: '/account/profile?Tab=Orders', label: 'Orders' },
                { href: '/PrivacyPolicy', label: 'Privacy' },
                { href: '/TermsConditions', label: 'Terms' },
              ],
            },
            {
              title: 'Shop',
              links: [
                { href: '/Store?category=Mens', label: 'Mens' },
                { href: '/Store?category=Womens', label: 'Womens' },
                { href: '/Store?sale=true', label: 'Sale' },
              ],
            },
          ].map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-gray-500">{group.title}</h3>
              <div className="mt-4 flex flex-col gap-2 text-sm">
                {group.links.map((link) => (
                  <Link key={link.href} href={link.href} className="hover:underline">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-10 border-t border-gray-300 pt-6 text-sm text-gray-500">
          © {new Date().getFullYear()} SHOP.CO. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
