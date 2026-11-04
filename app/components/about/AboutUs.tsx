import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Gem, HeartHandshake, Truck } from 'lucide-react'
import { MARKETING_IMAGES } from '@/lib/catalog/images'
import { SITE, whatsappLink } from '@/lib/site'

const values = [
  {
    Icon: Gem,
    title: 'Pieces chosen for everyday wear',
    text: 'We pick fabrics and fits that hold up to real life, from weekday basics to weekend favourites.',
  },
  {
    Icon: Truck,
    title: 'Clear delivery and returns',
    text: 'You see the delivery cost before you pay, and exchanges are handled by a real person.',
  },
  {
    Icon: HeartHandshake,
    title: 'Support that answers',
    text: 'Message us on WhatsApp, call, or use the assistant on the site. We reply, every time.',
  },
]

export const AboutUs = () => (
  <div className="mx-auto max-w-310 py-12">
    <section className="grid items-center gap-10 lg:grid-cols-2">
      <div>
        <p className="eyebrow">About Véora</p>
        <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">
          Modern fashion for <span className="text-brand">every you</span>
        </h1>
        <p className="mt-5 max-w-lg leading-7 text-gray-600">
          Véora is an online fashion store for women, men, kids, accessories and footwear. We keep the range focused,
          the prices clear and the service personal, so finding something you love feels easy.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/Store" className="inline-flex h-12 items-center gap-2 rounded-full bg-brand px-7 text-sm font-semibold text-white hover:bg-brand-dark">
            Shop the collection <ArrowRight size={16} />
          </Link>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center rounded-full border border-lavender-300 px-7 text-sm font-semibold hover:bg-lavender-50"
          >
            Talk to us
          </a>
        </div>
      </div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-lavender-100">
        <Image src={MARKETING_IMAGES.about} alt="Inside a Véora style edit" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
      </div>
    </section>

    <section className="mt-20">
      <h2 className="text-3xl font-extrabold">What we care about</h2>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {values.map(({ Icon, title, text }) => (
          <div key={title} className="rounded-3xl border border-lavender-200 bg-white p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-lavender-100 text-brand">
              <Icon size={20} />
            </span>
            <h3 className="mt-4 text-lg font-bold">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">{text}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="mt-20 rounded-[28px] bg-indigo-deep p-8 text-white sm:p-12">
      <h2 className="text-3xl font-extrabold">Questions before you order?</h2>
      <p className="mt-3 max-w-xl text-white/70">
        Call or message us on {SITE.phoneDisplay}, or email {SITE.email}. We are happy to help with sizing, delivery or
        anything else.
      </p>
      <Link href="/contact" className="mt-6 inline-flex h-12 items-center rounded-full bg-brand px-7 text-sm font-semibold hover:bg-brand-dark">
        Contact us
      </Link>
    </section>
  </div>
)
