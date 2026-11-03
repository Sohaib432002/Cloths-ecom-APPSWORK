import { Phone } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa6'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/commerce/pricing'
import { SITE, telLink, whatsappLink } from '@/lib/site'

export default function TopBar() {
  return (
    <div className="bg-indigo-deep text-[12px] text-white">
      <div className="mx-auto flex max-w-310 items-center justify-between gap-4 px-4 py-2 lg:px-6">
        <p className="truncate">
          Free shipping on orders over ${FREE_SHIPPING_THRESHOLD}
          <span className="hidden sm:inline"> · Use code WELCOME20 for 20% off your first order</span>
        </p>
        <div className="flex shrink-0 items-center gap-4">
          <a href={telLink} className="flex items-center gap-1.5 hover:text-brand-soft" aria-label={`Call ${SITE.phoneDisplay}`}>
            <Phone size={13} />
            <span className="hidden sm:inline">{SITE.phoneDisplay}</span>
            <span className="sm:hidden">Call</span>
          </a>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[#25D366]"
          >
            <FaWhatsapp size={14} className="text-[#25D366]" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}
