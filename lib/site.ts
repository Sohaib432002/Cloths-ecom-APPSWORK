// Single source of truth for contact details shown across the site and used by the assistant.
export const SITE = {
  name: 'Véora',
  tagline: 'Fashion Today. Confidence Tomorrow.',
  phone: '+923191057875',
  phoneDisplay: '+92 319 1057875',
  whatsappNumber: '923191057875',
  email: process.env.SUPPORT_EMAIL || 'sohaibmaqsoodsohaibmaqsood@gmail.com',
} as const

export function whatsappLink(message = 'Hi Véora, I need some help with my order.') {
  return `https://wa.me/${SITE.whatsappNumber}?text=${encodeURIComponent(message)}`
}

export const telLink = `tel:${SITE.phone}`
export const mailLink = `mailto:${SITE.email}`

/** Best-effort conversion of a customer-typed phone number to E.164. Returns null when it cannot be trusted. */
export function toE164(input: string, defaultCountryCode = '92') {
  const digits = input.replace(/[^\d+]/g, '')
  if (digits.startsWith('+')) return /^\+\d{8,15}$/.test(digits) ? digits : null
  if (digits.startsWith('00')) return /^\d{10,17}$/.test(digits) ? `+${digits.slice(2)}` : null
  if (digits.startsWith('0') && digits.length >= 10) return `+${defaultCountryCode}${digits.slice(1)}`
  return null
}
