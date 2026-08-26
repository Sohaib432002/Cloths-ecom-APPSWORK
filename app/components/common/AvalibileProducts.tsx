import React, { useEffect, useState } from 'react'
import Card from './card'
import Link from 'next/link'
import { MenuItems } from '@headlessui/react'

type Product = {
  id: number
  title: string
  price: number
  image: string
  slug: string
  rating: number
  discount: number
  sizes: string[]
  colors: string[]
}

type AvailbleProductProps = {
  headline: string
  products: Product[]
}

const AvalibileProducts = ({ headline, products }: AvailbleProductProps) => {
  // Show first 4 products

  const [randomProducts, setRandomProducts] = useState(products)

  useEffect(() => {
    const shuffled = [...products]

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))

      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    setRandomProducts(shuffled.slice(0, 4))
  }, [headline, products])

  // Button link according to section
  const section =
    headline.toUpperCase() === 'TOP SELLING'
      ? 'sale'
      : headline.toUpperCase() === 'NEW ARRIVALS'
        ? 'arrival'
        : ''

  return (
    <section className="my-16">
      <h2 className="mb-10 text-center text-4xl font-extrabold md:text-5xl">{headline}</h2>

      <div className="mx-auto max-w-310 ">
        <div className="grid grid-flow-col auto-cols-[260px] gap-5 overflow-x-auto pb-2 scrollbar-hide lg:grid-cols-4 lg:grid-flow-row lg:auto-cols-auto lg:overflow-visible">
          {randomProducts.slice(0, 4).map((item) => (
            <Link key={item.id} href={`/ProductDetails/${item.slug}`} className="w-full">
              <Card
                id={item.id}
                slug={item.slug}
                image={item.image}
                title={item.title}
                price={item.price}
                rating={item.rating}
                discount={item.discount}
                sizes={item.sizes}
                colors={item.colors}
              />
            </Link>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link href={section ? `/Store?${section}=true` : '/Store'}>
            <button
              className="
                rounded-full
                border-2
                border-gray-300
                px-12
                py-3
                text-sm
                font-medium
                transition-all
                duration-300
                hover:bg-black
                hover:text-white
                active:scale-95
                md:px-16
                md:text-base
              "
            >
              Show All
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default AvalibileProducts
