import type { Product, ProductQuery } from '@/types/product'

function searchableText(product: Product) {
  return [
    product.title,
    product.brand,
    product.category,
    product.type,
    product.style,
    product.sku,
    product.description,
    ...(product.colors || []),
    ...(product.features || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase()
}

export function filterProducts(products: Product[], query: ProductQuery) {
  const search = query.search?.toLowerCase().trim() || ''
  const keywords = search.split(/\s+/).filter(Boolean)

  return products.filter((item) => {
    if (query.sale && item.discount <= 0) return false
    if (query.arrival && !item.isNew) return false
    if (query.style && item.style !== query.style) return false
    if (query.category && item.category !== query.category) return false
    if (query.type && item.type !== query.type) return false
    if (typeof query.minPrice === 'number' && item.price < query.minPrice) return false
    if (typeof query.maxPrice === 'number' && item.price > query.maxPrice) return false
    if (query.color && !item.colors.includes(query.color)) return false
    if (query.size && !item.sizes.includes(query.size)) return false

    if (keywords.length > 0) {
      const haystack = searchableText(item)
      if (!keywords.every((word) => haystack.includes(word))) return false
    }

    return true
  })
}

export function sortProducts(products: Product[], sort: ProductQuery['sort'] = 'featured') {
  const next = [...products]

  switch (sort) {
    case 'price-asc':
      return next.sort((a, b) => a.price - b.price)
    case 'price-desc':
      return next.sort((a, b) => b.price - a.price)
    case 'rating':
      return next.sort((a, b) => b.rating - a.rating)
    case 'newest':
      return next.sort((a, b) => +new Date(b.arrivalDate) - +new Date(a.arrivalDate))
    default:
      return next.sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || b.rating - a.rating)
  }
}

export function paginate<T>(items: T[], page = 1, limit = 18) {
  const safePage = Math.max(1, page)
  const safeLimit = Math.min(48, Math.max(1, limit))
  const start = (safePage - 1) * safeLimit
  const end = start + safeLimit

  return {
    items: items.slice(start, end),
    page: safePage,
    limit: safeLimit,
    total: items.length,
    totalPages: Math.max(1, Math.ceil(items.length / safeLimit)),
  }
}

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
