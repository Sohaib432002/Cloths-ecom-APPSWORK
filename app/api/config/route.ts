import { jsonOk } from '@/lib/http'
import { emailEnabled, smsEnabled } from '@/lib/notify'
import { stripeEnabled } from '@/lib/payments/stripe'
import { SITE } from '@/lib/site'

// Public, non-secret configuration the storefront needs (which payment methods are live, how to reach support).
export async function GET() {
  return jsonOk({
    payments: { cod: true, card: stripeEnabled() },
    notifications: { email: emailEnabled(), sms: smsEnabled() },
    support: { phone: SITE.phoneDisplay, email: SITE.email },
  })
}
