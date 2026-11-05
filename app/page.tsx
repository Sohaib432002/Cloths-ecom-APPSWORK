import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Headphones, Package, ShieldCheck, Sparkles, Truck, Globe, Star, Boxes } from 'lucide-react'
import { getCategorySummary, getHomeCollections, getProductBySlug, getStoreStats } from '@/lib/catalog'
import { getTopReviews } from '@/lib/catalog/reviews'
import { MARKETING_IMAGES } from '@/lib/catalog/images'
import { FREE_SHIPPING_THRESHOLD } from '@/lib/commerce/pricing'
import ProductRail from './components/home/ProductRail'
import Reviews from './components/home/Reviews'
import SectionHeading from './components/home/SectionHeading'
import CollectionPreview from './components/home/CollectionPreview'
import Hero3D from './components/home/Hero3D'
import Showcase3D from './components/home/Showcase3D'
import Tilt from './components/home/Tilt'
import Reveal from './components/home/Reveal'

export const dynamic = 'force-dynamic'

const perks = [
  { Icon: Truck, title: 'Free Shipping', note: `On orders over $${FREE_SHIPPING_THRESHOLD}` },
  { Icon: ShieldCheck, title: 'Secure Payments', note: 'Protected checkout' },
  { Icon: Package, title: 'Easy Returns', note: '& Exchanges' },
  { Icon: Headphones, title: '24/7 Customer', note: 'Support' },
]

export default async function Home() {
  const [{ newArrivals, bestSellers }, stats, reviews, categories, bag, sneakers] = await Promise.all([
    getHomeCollections(),
    getStoreStats(),
    getTopReviews(6),
    getCategorySummary(),
    getProductBySlug('structured-top-handle-bag'),
    getProductBySlug('pastel-layer-sneakers'),
  ])

  const counts = Object.fromEntries(categories.map((category) => [category.name, category.count]))
  const categoryCards = [
    { name: 'Women', href: '/Store?category=Womens', image: MARKETING_IMAGES.women, count: counts.Womens },
    { name: 'Men', href: '/Store?category=Mens', image: MARKETING_IMAGES.men, count: counts.Mens },
    { name: 'Accessories', href: '/Store?category=Accessories', image: bag?.image, count: counts.Accessories },
    { name: 'Footwear', href: '/Store?category=Footwear', image: sneakers?.image, count: counts.Footwear },
  ]

  const lookbook = newArrivals.slice(0, 6).map((item) => ({
    slug: item.slug,
    title: item.title,
    image: item.image,
    price: item.price,
  }))
  const featuredBest = bestSellers[0]

  return (
    <div className="space-y-20 pb-4 sm:space-y-24">
      <section className="mx-auto max-w-310 pt-4 lg:pt-6">
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-lavender-100 via-lavender-50 to-white">
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-soft/30 blur-3xl" />
          <div className="relative grid grid-cols-1 items-center gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[1.05fr_0.95fr] lg:px-14 lg:py-0">
            <div className="min-w-0 lg:py-16">
              <p className="eyebrow">Style meets comfort</p>
              <h1 className="mt-4 text-[40px] font-extrabold leading-[1.05] sm:text-5xl lg:text-[56px]">
                Modern Fashion
                <br />
                For <span className="bg-gradient-to-r from-brand to-[#b07cf0] bg-clip-text text-transparent">Every You</span>
              </h1>
              <p className="mt-5 max-w-md text-[15px] leading-7 text-gray-600">
                Discover the latest trends in clothing, accessories and more. Premium quality, effortless style, all
                in one place.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
                <Link
                  href="/Store"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-brand px-8 text-[14px] font-semibold text-white shadow-[0_10px_24px_-8px_rgba(124,92,220,0.7)] transition hover:bg-brand-dark"
                >
                  Shop Now <ArrowRight size={16} />
                </Link>
                <CollectionPreview slides={lookbook} />
              </div>

              <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-4">
                {perks.map(({ Icon, title, note }) => (
                  <li key={title} className="flex flex-col gap-2">
                    <Icon size={26} strokeWidth={1.4} className="text-brand" />
                    <span className="text-xs leading-4 text-gray-600">
                      <span className="block font-medium text-black">{title}</span>
                      {note}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <Hero3D
              heroImage={MARKETING_IMAGES.hero}
              best={featuredBest ? { slug: featuredBest.slug, title: featuredBest.title, image: featuredBest.image, price: featuredBest.price } : undefined}
              floating={bestSellers[1] ? { slug: bestSellers[1].slug, title: bestSellers[1].title, image: bestSellers[1].image, price: bestSellers[1].price } : undefined}
              cube={newArrivals.slice(0, 4).map((item) => item.image)}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-310" aria-labelledby="categories-heading">
        <SectionHeading
          eyebrow="Shop by category"
          title={<span id="categories-heading">Find Your Perfect Style</span>}
          href="/Store"
          linkLabel="View All Categories"
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {categoryCards.map((card) => (
            <Tilt key={card.name} className="rounded-2xl">
            <Link
              href={card.href}
              className="group block h-full overflow-hidden rounded-2xl bg-lavender-100 p-2.5 shadow-[0_10px_30px_-18px_rgba(98,72,196,0.5)] transition duration-300 hover:shadow-[0_30px_50px_-20px_rgba(98,72,196,0.55)]"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-lavender-200" style={{ transform: 'translateZ(26px)' }}>
                {card.image && (
                  <Image
                    src={card.image}
                    alt={`${card.name} collection`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="px-1.5 pb-1 pt-3" style={{ transform: 'translateZ(14px)' }}>
                <p className="text-[15px] font-semibold">{card.name}</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-brand">
                  Shop Now <ArrowRight size={12} className="transition group-hover:translate-x-0.5" />
                </p>
              </div>
            </Link>
            </Tilt>
          ))}
        </div>
      </section>

      {lookbook.length >= 3 && (
      <Reveal>
        <section className="mx-auto max-w-310" aria-labelledby="showcase-heading">
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-b from-indigo-deeper via-indigo-deep to-[#3a2a8a] px-4 py-12 text-white sm:px-10 sm:py-16">
            <div className="pointer-events-none absolute left-1/2 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-brand/40 blur-3xl" />
            <div className="relative text-center">
              <p className="eyebrow !text-brand-soft">Spin the collection</p>
              <h2 id="showcase-heading" className="mt-3 text-3xl font-extrabold sm:text-4xl">
                See the new season <span className="text-brand-soft">from every angle</span>
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/65">
                Drag the ring or use the arrows. Tap a piece to see it up close.
              </p>
            </div>
            <div className="relative mt-4">
              <Showcase3D items={lookbook} />
            </div>
          </div>
        </section>
      </Reveal>
      )}

      <ProductRail
        id="best-sellers"
        eyebrow="Featured products"
        headline="Best Sellers"
        products={bestSellers.slice(0, 4)}
        href="/Store?sort=rating"
      />

      <section className="mx-auto max-w-310">
        <div className="relative overflow-hidden rounded-[28px] bg-indigo-deep text-white">
          <div className="pointer-events-none absolute -left-16 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-brand/30 blur-3xl" />
          <div className="relative grid items-center gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[0.8fr_1.1fr_0.9fr] lg:gap-6 lg:px-12 lg:py-0">
            <div className="relative mx-auto hidden h-72 w-full max-w-[300px] lg:block">
              <div className="absolute bottom-0 left-0 h-[88%] w-[56%] overflow-hidden rounded-t-[90px] bg-lavender-200">
                <Image src={MARKETING_IMAGES.couple2} alt="" fill sizes="180px" className="object-cover" />
              </div>
              <div className="absolute bottom-0 right-0 h-[100%] w-[56%] overflow-hidden rounded-t-[90px] bg-brand-soft">
                <Image src={MARKETING_IMAGES.couple} alt="" fill sizes="180px" className="object-cover" />
              </div>
            </div>

            <div className="lg:py-14">
              <p className="eyebrow !text-brand-soft">Your style. Our passion.</p>
              <h2 className="mt-3 text-3xl font-extrabold leading-tight sm:text-[34px]">
                Quality Fashion
                <br />
                At Your Fingertips
              </h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-white/70">
                Every piece is picked for fit, fabric and everyday wear. Start with the new arrivals or ask our
                stylist to build a look around your occasion.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/Store?arrival=true"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-7 text-[13px] font-semibold text-white transition hover:bg-brand-dark"
                >
                  Shop Now <ArrowRight size={15} />
                </Link>
                <Link
                  href="/stylist"
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-white/25 px-6 text-[13px] font-semibold text-white transition hover:bg-white/10"
                >
                  <Sparkles size={15} /> Ask the stylist
                </Link>
              </div>
            </div>

            <dl className="grid gap-5 border-white/15 sm:grid-cols-3 lg:grid-cols-1 lg:border-l lg:py-14 lg:pl-10">
              {[
                { Icon: Boxes, value: `${stats.products.toLocaleString('en-US')}+`, label: 'Products' },
                { Icon: Star, value: `${stats.reviews.toLocaleString('en-US')}+`, label: 'Customer reviews' },
                { Icon: Globe, value: `$${FREE_SHIPPING_THRESHOLD}`, label: 'Free shipping from' },
              ].map(({ Icon, value, label }) => (
                <div key={label} className="flex items-center gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10">
                    <Icon size={20} strokeWidth={1.5} />
                  </span>
                  <div>
                    <dd className="text-xl font-bold leading-none">{value}</dd>
                    <dt className="mt-1 text-xs text-white/65">{label}</dt>
                  </div>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <ProductRail
        eyebrow="Just landed"
        headline="New Arrivals"
        products={newArrivals.slice(0, 4)}
        href="/Store?arrival=true"
        linkLabel="View All New In"
      />

      <Reviews reviews={reviews} />
    </div>
  )
}
