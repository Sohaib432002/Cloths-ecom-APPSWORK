'use client'

import { useEffect, useState } from 'react'
import { MessageCircle, Phone, Mail, X } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa6'
import { usePathname } from 'next/navigation'
import { StylistChat } from '@/app/components/stylist/StylistChat'
import { LogoMark } from './Logo'
import { SITE, mailLink, telLink, whatsappLink } from '@/lib/site'

const PROMPTS = ['Show me sneakers under $80', 'Delivery and returns', 'Track my order', 'Talk to a person']

// Floating help: WhatsApp (human chat), phone call, and the Véora assistant that answers questions and finds products.
export default function SupportWidget() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => setOpen(false), [pathname])

  const action =
    'flex flex-1 items-center justify-center gap-2 rounded-full border border-lavender-200 px-3 py-2 text-xs font-semibold transition hover:bg-lavender-50'

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_24px_-8px_rgba(37,211,102,0.8)] transition hover:scale-105"
        >
          <FaWhatsapp size={30} />
        </a>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? 'Close assistant' : 'Open assistant'}
          className="flex h-14 items-center gap-2 rounded-full bg-brand px-5 text-sm font-semibold text-white shadow-[0_10px_24px_-8px_rgba(124,92,220,0.8)] transition hover:bg-brand-dark"
        >
          {open ? <X size={20} /> : <MessageCircle size={20} />}
          <span className="hidden sm:inline">{open ? 'Close' : 'Chat with us'}</span>
        </button>
      </div>

      {open && (
        <section
          role="dialog"
          aria-label="Véora assistant"
          className="fixed inset-x-0 bottom-0 z-50 flex h-[min(640px,88vh)] flex-col rounded-t-3xl border border-lavender-200 bg-white shadow-2xl sm:inset-x-auto sm:bottom-24 sm:right-6 sm:w-[390px] sm:rounded-3xl"
        >
          <header className="flex items-center gap-3 rounded-t-3xl bg-indigo-deep px-5 py-4 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
              <LogoMark className="h-6 w-6" />
            </span>
            <div className="flex-1">
              <p className="font-semibold leading-tight">Véora Assistant</p>
              <p className="flex items-center gap-1.5 text-xs text-white/70">
                <span className="h-2 w-2 rounded-full bg-emerald-400" /> Online · replies instantly
              </p>
            </div>
            <button type="button" aria-label="Close assistant" onClick={() => setOpen(false)}>
              <X size={20} />
            </button>
          </header>

          <div className="flex gap-2 border-b border-lavender-100 px-4 py-3">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={action}>
              <FaWhatsapp size={15} className="text-[#25D366]" /> WhatsApp
            </a>
            <a href={telLink} className={action}>
              <Phone size={14} className="text-brand" /> Call
            </a>
            <a href={mailLink} className={action}>
              <Mail size={14} className="text-brand" /> Email
            </a>
          </div>

          <div className="min-h-0 flex-1 p-4">
            <StylistChat
              compact
              endpoint="/api/assistant"
              prompts={PROMPTS}
              greeting={`Hi! I'm the Véora assistant. Ask me about products, delivery, returns, offers or your order. For a person, WhatsApp or call ${SITE.phoneDisplay}.`}
              placeholder="Ask about products, delivery, orders..."
            />
          </div>
        </section>
      )}
    </>
  )
}
