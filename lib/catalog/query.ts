import type { ProductQuery } from '@/types/product'

export function queryFromSearchParams(searchParams: URLSearchParams): ProductQuery {
  const minPrice = searchParams.get('minPrice')
  const maxPrice = searchParams.get('maxPrice')
  const page = searchParams.get('page')
  const limit = searchParams.get('limit')
  const sort = searchParams.get('sort') as ProductQuery['sort']

  return {
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    type: searchParams.get('type') || undefined,
    style: searchParams.get('style') || undefined,
    color: searchParams.get('color') || undefined,
    size: searchParams.get('size') || undefined,
    sale: searchParams.get('sale') === 'true',
    arrival: searchParams.get('arrival') === 'true',
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 18,
    sort: sort || 'featured',
  }
}
