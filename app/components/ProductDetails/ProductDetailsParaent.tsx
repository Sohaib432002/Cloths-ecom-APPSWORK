'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ProductDetailslider } from './ProductDetailsSlider'
import { SpecificProductDetails } from './SpecficProductDetails'
import { ColorSelectProductDetails } from './ColorSelectProductDetails'
import { ProductDetailsSizeChoser } from './ProductDetailsSizeChoser'
import { ProductAddtoCartDetails } from './AddtoCartProductDetails'
import { AboutProductDetails } from './ProductDetailsAbout'
import { RelatedProductAboutDetails } from './RelatedProductDetails'
import { StylistChat } from '@/app/components/stylist/StylistChat'
import type { Product, ProductReview } from '@/types/product'

type Props = {
  product: Product
  related: Product[]
  reviews: ProductReview[]
}

export const ProductDetailsParaent = ({ product, related, reviews }: Props) => {
  const [productSpecifications, setProductSpecifications] = useState({
    color: product.colors[0] ?? '',
    size: product.sizes[0] ?? '',
  })

  const { title, rating, image, gallery, discount, description, price, slug, colors, sizes } = product

  return (
    <div className="mx-auto mt-10 max-w-310 px-4">
      <div className="grid gap-10 lg:grid-cols-2">
        <ProductDetailslider image={image} gallery={gallery} Productslug={slug} />
        <div>
          <SpecificProductDetails
            title={title}
            rating={rating}
            discount={discount}
            price={product.oldPrice || price}
            finalPrice={price}
            description={description}
            slug={slug}
            id={product.id}
            image={product.image}
            sizes={product.sizes}
            colors={product.colors}
            stock={product.stock}
          />
          <hr className="my-6" />
          <ColorSelectProductDetails
            colors={colors}
            setProductSpecifications={setProductSpecifications}
          />
          <hr className="my-6" />
          <ProductDetailsSizeChoser
            sizes={sizes}
            setProductSpecifications={setProductSpecifications}
          />
          <hr className="my-6" />
          <ProductAddtoCartDetails product={product} ProductSpecifications={productSpecifications} />
        </div>
      </div>

      <div className="mt-12 rounded-3xl border bg-lavender-50 p-5 sm:p-8">
        <h2 className="text-2xl font-bold">Ask the stylist about this piece</h2>
        <p className="mt-2 text-sm text-gray-600">
          Get pairing ideas, occasion advice, and similar catalog matches without leaving the page.
        </p>
        <div className="mt-6">
          <StylistChat
            productSlug={slug}
            initialPrompt={`How should I style the ${title}?`}
          />
        </div>
      </div>

      <div className="mt-16">
        <AboutProductDetails productReviews={{ [slug]: reviews }} slug={slug} productId={product.id} />
      </div>

      <div className="my-16">
        <RelatedProductAboutDetails products={related} />
      </div>

      <p className="mb-10 text-center text-sm">
        <Link href="/Store" className="underline">
          Continue shopping
        </Link>
      </p>
    </div>
  )
}
