'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { FaFacebookF, FaInstagram, FaPinterestP, FaTiktok, FaXTwitter } from 'react-icons/fa6'
import { apiFetch } from '@/lib/client/api'
import Logo from './Logo'

const socials = [
  { label: 'Instagram', href: 'https://www.instagram.com', Icon: FaInstagram },
  { label: 'Facebook', href: 'https://www.facebook.com', Icon: FaFacebookF },
  { label: 'X', href: 'https://x.com', Icon: FaXTwitter },
  { label: 'Pinterest', href: 'https://www.pinterest.com', Icon: FaPinterestP },
  { label: 'TikTok', href: 'https://www.tiktok.com', Icon: FaTiktok },
]

const groups = [
  {
    title: 'Quick Links',
    links: [
      { href: '/', label: 'Home' },
      { href: '/Store', label: 'Shop' },
      { href: '/about', label: 'About' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    title: 'Customer Care',
    links: [
      { href: '/help#shipping', label: 'Shipping Info' },
      { href: '/help#returns', label: 'Returns & Exchanges' },
      { href: '/help#faq', label: 'FAQs' },
      { href: '/contact', label: 'Support' },
    ],
  },
]

const Footer = () => {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const subscribe = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setStatus(null)
    try {
      const data = await apiFetch<{ message: string }>('/api/newsletter', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
      setStatus({ ok: true, text: data.message })
      setEmail('')
    } catch (error) {
      setStatus({ ok: false, text: error instanceof Error ? error.message : 'Unable to subscribe right now.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <footer className="mt-24 border-t border-lavender-200/70 bg-white">
      <div className="mx-auto grid max-w-310 gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.6fr] lg:px-6">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-6 text-gray-500">Fashion Today. Confidence Tomorrow.</p>
        </div>

        {groups.map((group) => (
          <div key={group.title}>
            <h3 className="text-sm font-semibold tracking-normal">{group.title}</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-500">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition hover:text-brand">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="text-sm font-semibold tracking-normal">Stay Updated</h3>
          <p className="mt-4 text-sm text-gray-500">Get the latest styles and offers.</p>
          <form onSubmit={subscribe} className="mt-3 flex items-center gap-2" noValidate>
            <label htmlFor="newsletter-email" className="sr-only">
              Your email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email address"
              className="h-11 min-w-0 flex-1 rounded-full bg-lavender-100 px-4 text-sm outline-none ring-brand/40 placeholder:text-gray-400 focus:ring-2"
            />
            <button
              type="submit"
              disabled={loading}
              aria-label="Subscribe to the newsletter"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand text-white transition hover:bg-brand-dark disabled:opacity-60"
            >
              <ArrowRight size={18} />
            </button>
          </form>
          <p
            role="status"
            className={`mt-2 min-h-5 text-xs ${status ? (status.ok ? 'text-emerald-700' : 'text-red-600') : ''}`}
          >
            {status?.text}
          </p>
          <div className="mt-3 flex items-center gap-2.5">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-lavender-200 text-black transition hover:border-brand hover:bg-brand hover:text-white"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-lavender-200/70">
        <div className="mx-auto flex max-w-310 flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-gray-500 sm:flex-row lg:px-6">
          <p>© {new Date().getFullYear()} Véora. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/PrivacyPolicy" className="hover:text-brand">
              Privacy
            </Link>
            <Link href="/TermsConditions" className="hover:text-brand">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
