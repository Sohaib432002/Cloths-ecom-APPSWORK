'use client'

import Link from 'next/link'
import ProductCard from '../common/ProductCard'
import type { Product } from '@/types/product'

export default function ProductRail({
  headline,
  products,
  href,
}: {
  headline: string
  products: Product[]
  href: string
}) {
  return (
    <section className="my-16">
      <h2 className="mb-10 text-center text-4xl font-extrabold md:text-5xl">{headline}</h2>
      <div className="grid grid-flow-col auto-cols-[240px] gap-4 overflow-x-auto pb-2 scrollbar-hide sm:auto-cols-[260px] lg:grid-cols-4 lg:grid-flow-row lg:overflow-visible">
        {products.slice(0, 8).map((item) => (
          <ProductCard
            key={item.id}
            id={item.id}
            slug={item.slug}
            image={item.image}
            title={item.title}
            price={item.price}
            rating={item.rating}
            discount={item.discount}
            sizes={item.sizes}
            colors={item.colors}
            stock={item.stock}
          />
        ))}
      </div>
      <div className="mt-10 flex justify-center">
        <Link href={href} className="rounded-full border-2 border-gray-300 px-12 py-3 font-medium hover:bg-black hover:text-white">
          Show All
        </Link>
      </div>
    </section>
  )
}
