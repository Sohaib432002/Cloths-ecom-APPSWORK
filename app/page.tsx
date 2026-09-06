import Link from 'next/link'
import Image from 'next/image'
import { getHomeCollections } from '@/lib/catalog'
import { MARKETING_IMAGES } from '@/lib/catalog/images'
import ProductRail from './components/home/ProductRail'
import Reviews from './components/home/Reviews'

export default function Home() {
  const { newArrivals, topSelling } = getHomeCollections()

  const styles = [
    { title: 'Casual', image: MARKETING_IMAGES.casual, className: 'md:col-span-1' },
    { title: 'Formal', image: MARKETING_IMAGES.formal, className: 'md:col-span-2' },
    { title: 'Party', image: MARKETING_IMAGES.party, className: 'md:col-span-2' },
    { title: 'Gym', image: MARKETING_IMAGES.gym, className: 'md:col-span-1' },
  ]

  return (
    <div className="mx-auto max-w-310 px-4">
      <section className="grid items-center gap-10 pt-10 lg:grid-cols-2 lg:pt-16">
        <div className="text-center lg:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">Autumn edit</p>
          <h1 className="mt-3 text-4xl font-black leading-none sm:text-5xl lg:text-6xl">
            Find clothes that match your style
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-gray-600 sm:text-base lg:mx-0">
            Shop a focused catalog of denim, knits, polos, and outerwear, then let the in-house
            stylist assemble a complete look around your occasion.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Link href="/Store" className="rounded-xl bg-black px-8 py-4 text-center font-semibold text-white hover:bg-gray-800">
              Shop Now
            </Link>
            <Link href="/stylist" className="rounded-xl border px-8 py-4 text-center font-semibold hover:bg-gray-50">
              Ask the Stylist
            </Link>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-6 text-center md:grid-cols-3 lg:text-left">
            <div className="border-r border-gray-300 pr-4">
              <h2 className="text-3xl font-extrabold">1,050+</h2>
              <p className="mt-2 text-sm text-gray-500">Catalog pieces</p>
            </div>
            <div className="border-r border-gray-300 pr-4">
              <h2 className="text-3xl font-extrabold">4</h2>
              <p className="mt-2 text-sm text-gray-500">Dress styles</p>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h2 className="text-3xl font-extrabold">AI</h2>
              <p className="mt-2 text-sm text-gray-500">Personal stylist</p>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[2rem] bg-gray-100">
          <Image
            src={MARKETING_IMAGES.hero}
            alt="Model wearing SHOP.CO seasonal looks"
            width={900}
            height={1100}
            priority
            className="h-auto w-full object-cover"
          />
        </div>
      </section>

      <div className="relative mt-10 overflow-hidden bg-black py-7">
        <div className="flex w-max items-center gap-16 px-8 animate-brand-scroll text-white">
          {['Versace', 'Zara', 'Gucci', 'Prada', 'Calvin Klein', 'Versace', 'Zara', 'Gucci', 'Prada', 'Calvin Klein'].map(
            (brand, index) => (
              <span key={`${brand}-${index}`} className="text-xl font-black tracking-wide sm:text-3xl">
                {brand}
              </span>
            )
          )}
        </div>
      </div>

      <ProductRail headline="NEW ARRIVALS" products={newArrivals} href="/Store?arrival=true" />
      <hr className="border-gray-200" />
      <ProductRail headline="TOP SELLING" products={topSelling} href="/Store?sale=true" />

      <section className="my-20">
        <div className="rounded-3xl bg-[#F2F0F1] p-5 md:p-8">
          <h2 className="mb-10 text-center text-3xl font-black sm:text-5xl">Browse by dress style</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {styles.map((item) => (
              <Link
                key={item.title}
                href={`/Store?style=${item.title}`}
                className={`${item.className} group relative overflow-hidden rounded-3xl bg-white shadow-md`}
              >
                <Image
                  src={item.image}
                  alt={`${item.title} clothing`}
                  width={900}
                  height={600}
                  className="h-[280px] w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <h3 className="absolute left-6 top-6 text-3xl font-bold">{item.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-10 overflow-hidden rounded-3xl bg-black px-6 py-10 text-white md:px-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-gray-400">Native AI feature</p>
            <h2 className="mt-2 text-3xl font-black md:text-4xl">A stylist that shops the catalog with you</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-300">
              Describe a wedding, commute, or gym session. Llama 3.1 via Hugging Face turns that into
              a real outfit from current SHOP.CO inventory.
            </p>
          </div>
          <Link href="/stylist" className="rounded-full bg-white px-6 py-3 font-semibold text-black">
            Open Stylist
          </Link>
        </div>
      </section>

      <Reviews />
    </div>
  )
}
