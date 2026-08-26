'use client'

import { useEffect, useState } from 'react'
import Card from '../common/card'
import { products } from '../../../app/lib/data/products'
import Link from 'next/link'

type RelatedProductProps = {
  type: string
  slug?: string
}

export const RelatedProductAboutDetails = ({ type, slug }: RelatedProductProps) => {
  const filteredProducts = products.filter((item) => item.type === type && item.slug !== slug)

  const [randomProducts, setRandomProducts] = useState(filteredProducts.slice(0, 4))

  useEffect(() => {
    const shuffled = [...filteredProducts]

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))

      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }

    setRandomProducts(shuffled.slice(0, 4))
  }, [type, slug])

  return (
    <section
      className="
      my-10
      sm:mt-16
    "
    >
      <h2
        className="
        mb-6
        text-center
        text-2xl
        font-bold
        sm:text-3xl
      "
      >
        YOU MIGHT ALSO LIKE
      </h2>

      {randomProducts.length > 0 ? (
        <div
          className="
          grid
          grid-cols-2
          gap-4
          sm:grid-cols-3
          lg:grid-cols-4
          sm:gap-6
          
        "
        >
          {randomProducts.map((item) => (
            <Link key={item.id} href={`/ProductDetails/${item.slug}`}>
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
      ) : (
        <p
          className="
          text-center
          text-gray-500
        "
        >
          No related products found
        </p>
      )}
    </section>
  )
}
