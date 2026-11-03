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

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.gallery,
    sku: product.sku,
    brand: { '@type': 'Brand', name: product.brand },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'USD',
      price: product.price,
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
    ...(product.reviews > 0
      ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: product.rating, reviewCount: product.reviews } }
      : {}),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <ProductDetailsParaent
        product={product}
        related={await getRelatedProducts(product)}
        reviews={await getReviewsForProduct(product.id)}
      />
    </>
  )
}
