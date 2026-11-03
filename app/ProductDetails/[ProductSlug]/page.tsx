import { notFound } from 'next/navigation'
import { ProductDetailsParaent } from '@/app/components/ProductDetails/ProductDetailsParaent'
import { getProductBySlug, getRelatedProducts } from '@/lib/catalog'
import { getReviewsForProduct } from '@/lib/catalog/reviews'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ ProductSlug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ProductSlug } = await params
  const product = await getProductBySlug(ProductSlug)
  if (!product) return { title: 'Product not found' }
  return {
    title: product.title,
    description: product.description,
  }
}

export default async function Page({ params }: Props) {
  const { ProductSlug } = await params
  const product = await getProductBySlug(ProductSlug)
  if (!product) notFound()

  return (
    <ProductDetailsParaent
      product={product}
      related={await getRelatedProducts(product)}
      reviews={await getReviewsForProduct(product.id)}
    />
  )
}
