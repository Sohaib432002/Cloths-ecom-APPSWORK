import { getProductBySlug, getRelatedProducts } from '@/lib/catalog'
import { getReviewsForProduct } from '@/lib/catalog/reviews'
import { jsonError, jsonOk } from '@/lib/http'

type Params = {
  params: Promise<{ slug: string }>
}

export async function GET(_request: Request, { params }: Params) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    return jsonError('Product not found.', 404, 'NOT_FOUND')
  }

  return jsonOk({
    product,
    related: getRelatedProducts(product),
    reviews: getReviewsForProduct(product.slug),
  })
}
