'use client'

import Image from 'next/image'
import Link from 'next/link'

const HeroSection = () => {
  const brands = [
    {
      src: '/images/home/brands/1.png',
      alt: 'Versace',
    },
    {
      src: '/images/home/brands/2.png',
      alt: 'Zara',
    },
    {
      src: '/images/home/brands/3.png',
      alt: 'Gucci',
    },
    {
      src: '/images/home/brands/4.png',
      alt: 'Prada',
    },
    {
      src: '/images/home/brands/5.png',
      alt: 'Calvin Klein',
    },
  ]

  return (
    <section className="">
      <div className="mx-auto grid max-w-310 items-center gap-10  pt-10 lg:grid-cols-2  lg:pt-16">
        {/* Left Content */}
        <div className="text-center lg:text-left">
          <h1 className="text-4xl font-black leading-none sm:text-5xl lg:text-6xl">
            FIND CLOTHES
            <br />
            THAT MATCHES
            <br />
            YOUR STYLE
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-gray-600 sm:text-base lg:mx-0">
            Browse through our diverse range of meticulously crafted garments, designed to bring out
            your individuality and perfectly match your unique style.
          </p>

          <Link href="/Store">
            <button className="mt-8 w-full rounded-xl bg-black px-8 py-4 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:bg-gray-800 lg:w-56">
              Shop Now
            </button>
          </Link>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-6 text-center md:grid-cols-3 lg:text-left">
            <div className="border-r border-gray-300 pr-4">
              <h2 className="text-3xl font-extrabold sm:text-4xl">200+</h2>
              <p className="mt-2 text-sm text-gray-500">International Brands</p>
            </div>

            <div className="border-r border-gray-300 pr-4">
              <h2 className="text-3xl font-extrabold sm:text-4xl">2,000+</h2>
              <p className="mt-2 text-sm text-gray-500">High Quality Products</p>
            </div>

            <div className="col-span-2 md:col-span-1">
              <h2 className="text-3xl font-extrabold sm:text-4xl">30,000+</h2>
              <p className="mt-2 text-sm text-gray-500">Happy Customers</p>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative flex justify-center">
          <Image
            src="/images/home/HeroSection/hero.png"
            alt="Fashion Model"
            width={620}
            height={760}
            priority
            className="h-auto w-full max-w-xl object-contain"
          />
        </div>
      </div>

      {/* Brand Slider */}
      <div className="relative  overflow-hidden bg-black py-7">
        {/* Left Fade */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-black via-black/90 to-transparent" />

        {/* Right Fade */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-black via-black/90 to-transparent" />

        <div className="flex w-max items-center gap-12 px-8 animate-brand-scroll sm:gap-16 lg:gap-24">
          {[...brands, ...brands].map((brand, index) => (
            <Image
              key={`${brand.alt}-${index}`}
              src={brand.src}
              alt={brand.alt}
              width={160}
              height={50}
              className="h-7 w-auto opacity-80 transition-all duration-300 hover:scale-110 hover:opacity-100 sm:h-8 lg:h-10"
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSection
