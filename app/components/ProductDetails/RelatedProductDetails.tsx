'use client'

import ProductCard from '../common/ProductCard'
import type { Product } from '@/types/product'

export const RelatedProductAboutDetails = ({ products }: { products: Product[] }) => {
  return (
    <section className="my-10 sm:mt-16">
      <h2 className="mb-6 text-center text-2xl font-bold sm:text-3xl">You might also like</h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
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
      ) : (
        <p className="text-center text-gray-500">No related products found</p>
      )}
    </section>
  )
}
