import type { Metadata } from 'next'
import Link from 'next/link'
import { DELIVERY_FEE, FREE_SHIPPING_THRESHOLD } from '@/lib/commerce/pricing'

export const metadata: Metadata = {
  title: 'Help & Customer Care',
  description: 'Shipping, returns and frequently asked questions.',
}

const faqs = [
  {
    q: 'How do I track my order?',
    a: 'Sign in and open Orders in your account to see the status of every order you have placed.',
  },
  {
    q: 'Which payment methods can I use?',
    a: 'Cash on delivery, card and PayPal are available at checkout.',
  },
  {
    q: 'Can I use more than one coupon?',
    a: 'One coupon code can be applied per order. The active codes are listed on the cart page.',
  },
  {
    q: 'How do I find my size?',
    a: 'Each product page lists the available sizes. Ask our AI stylist from any product page if you want a second opinion.',
  },
]

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 lg:px-6">
      <p className="eyebrow">Customer care</p>
      <h1 className="mt-3 text-4xl font-extrabold">How can we help?</h1>

      <section id="shipping" className="mt-12 scroll-mt-24">
        <h2 className="text-2xl font-bold">Shipping info</h2>
        <p className="mt-3 leading-7 text-gray-600">
          Standard delivery costs ${DELIVERY_FEE}. Orders of ${FREE_SHIPPING_THRESHOLD} or more ship free, and the
          FREESHIP coupon waives the delivery fee on any order. Your delivery cost is shown in the order summary before
          you pay.
        </p>
      </section>

      <section id="returns" className="mt-10 scroll-mt-24">
        <h2 className="text-2xl font-bold">Returns &amp; exchanges</h2>
        <p className="mt-3 leading-7 text-gray-600">
          If something does not fit or is not what you expected, contact us with your order number and we will arrange a
          return or exchange. Items should be unworn and in their original condition.
        </p>
        <Link href="/contact" className="mt-4 inline-block font-semibold text-brand hover:underline">
          Contact support
        </Link>
      </section>

      <section id="faq" className="mt-10 scroll-mt-24">
        <h2 className="text-2xl font-bold">FAQs</h2>
        <div className="mt-4 divide-y divide-lavender-200 rounded-2xl border border-lavender-200">
          {faqs.map((item) => (
            <details key={item.q} className="group p-5">
              <summary className="cursor-pointer list-none font-semibold">{item.q}</summary>
              <p className="mt-2 leading-7 text-gray-600">{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  )
}
