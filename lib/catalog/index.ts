import 'server-only'

import { products as rawProducts } from '@/app/lib/data/products'
import type { Product, ProductQuery } from '@/types/product'
import { resolveProductGallery, resolveProductImage } from './images'
import { filterProducts, paginate, sortProducts } from './query'

function withImages(product: Product): Product {
  const image = resolveProductImage(product)
  return {
    ...product,
    image,
    gallery: resolveProductGallery(product),
    currency: '$',
  }
}

let catalogCache: Product[] | null = null

export function getCatalog(): Product[] {
  if (!catalogCache) {
    catalogCache = (rawProducts as Product[]).map(withImages)
  }
  return catalogCache
}

export function getProductBySlug(slug: string) {
  return getCatalog().find((item) => item.slug === slug) || null
}

export function getProductById(id: number) {
  return getCatalog().find((item) => item.id === id) || null
}

export function getRelatedProducts(product: Product, limit = 8) {
  return getCatalog()
    .filter((item) => item.slug !== product.slug && (item.type === product.type || item.style === product.style))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
}

export function searchCatalog(query: ProductQuery) {
  const filtered = sortProducts(filterProducts(getCatalog(), query), query.sort)
  const page = paginate(filtered, query.page, query.limit)

  return {
    ...page,
    facets: {
      categories: [...new Set(getCatalog().map((item) => item.category))],
      types: [...new Set(getCatalog().map((item) => item.type))],
      styles: [...new Set(getCatalog().map((item) => item.style))],
      colors: [...new Set(getCatalog().flatMap((item) => item.colors))],
      sizes: [...new Set(getCatalog().flatMap((item) => item.sizes))],
    },
  }
}

export function getHomeCollections() {
  const catalog = getCatalog()
  const newest = [...catalog].sort((a, b) => +new Date(b.arrivalDate) - +new Date(a.arrivalDate))
  const selling = [...catalog].sort((a, b) => b.reviews - a.reviews || b.rating - a.rating)

  return {
    newArrivals: newest.slice(0, 8),
    topSelling: selling.slice(0, 8),
    featured: catalog.filter((item) => item.isFeatured).slice(0, 8),
  }
}

export function getCatalogSummary() {
  const catalog = getCatalog()
  return {
    count: catalog.length,
    styles: [...new Set(catalog.map((item) => item.style))],
    categories: [...new Set(catalog.map((item) => item.category))],
    types: [...new Set(catalog.map((item) => item.type))],
  }
}

export function toCard(product: Product) {
  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    price: product.price,
    image: product.image,
    rating: product.rating,
    discount: product.discount,
    sizes: product.sizes,
    colors: product.colors,
    stock: product.stock,
  }
}
