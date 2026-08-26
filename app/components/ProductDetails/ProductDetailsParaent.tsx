'use client'

import React, { useState } from 'react'
import { ProductDetailslider } from './ProductDetailsSlider'
import { SpecificProductDetails } from './SpecficProductDetails'
import { ColorSelectProductDetails } from './ColorSelectProductDetails'
import { ProductDetailsSizeChoser } from './ProductDetailsSizeChoser'
import { ProductAddtoCartDetails } from './AddtoCartProductDetails'
import { AboutProductDetails } from './ProductDetailsAbout'
import { RelatedProductAboutDetails } from './RelatedProductDetails'
import { productReviews } from '@/app/lib/data/ProductReviews'
import { useProducts } from '../../../context/ProductsContext'
import { LoadingSpinner } from '../../components/common/Spinner'

type PropsProductDetailsParent = {
  productslug: string
}

type ProductSpecifications = {
  color: string
  size: string
}

export const ProductDetailsParaent = ({ productslug }: PropsProductDetailsParent) => {
  const { products, loading, error } = useProducts()

  if (loading) {
    return <LoadingSpinner text="Loading Product..." size="lg" />
  }

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-circle-exclamation text-5xl text-red-500"></i>
          <h2 className="mt-4 text-2xl font-semibold">Something went wrong</h2>
          <p className="mt-2 text-gray-500">{error}</p>
        </div>
      </div>
    )
  }

  // Find Product
  const product = products.find((item) => item.slug === productslug)

  // Product Not Found
  if (!product) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <i className="fa-solid fa-box-open text-6xl text-gray-400"></i>
          <h2 className="mt-4 text-3xl font-bold">Product Not Found</h2>
          <p className="mt-2 text-gray-500">
            The product you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
        </div>
      </div>
    )
  }

  const { title, rating, image, gallery, discount, description, price, slug, colors, type, sizes } =
    product

  const finalPrice = price - (price * discount) / 100

  const [productSpecifications, setProductSpecifications] = useState<ProductSpecifications>({
    color: colors[0] ?? '',
    size: sizes[0] ?? '',
  })

  return (
    <div className="max-w-310 mx-auto mt-10">
      <div className="grid gap-10 lg:grid-cols-2">
        <ProductDetailslider image={image} gallery={gallery} Productslug={slug} />

        <div>
          <SpecificProductDetails
            title={title}
            rating={rating}
            discount={discount}
            price={price}
            finalPrice={finalPrice}
            description={description}
            slug={slug}
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

          <ProductAddtoCartDetails
            product={product}
            ProductSpecifications={productSpecifications}
          />
        </div>
      </div>

      <div className="mt-16">
        <AboutProductDetails productReviews={productReviews} slug={slug} />
      </div>

      <div className="my-16">
        <RelatedProductAboutDetails type={type} />
      </div>
    </div>
  )
}
