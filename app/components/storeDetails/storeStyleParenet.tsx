'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'

import { DeskTopFilter, Header, Products } from '../storeDetails'
import { useProducts } from '@/context/ProductsContext'
import { LoadingSpinner } from '../common/Spinner'

export const DressingStyleParenet = () => {
  const searchParams = useSearchParams()

  const sale = searchParams.get('sale')
  const style = searchParams.get('style')
  const arrival = searchParams.get('arrival')
  const category = searchParams.get('category')
  const type = searchParams.get('type')
  const color = searchParams.get('color')
  const size = searchParams.get('size')
  const search = searchParams.get('search')?.toLowerCase().trim() || ''

  const minPrice = Number(searchParams.get('minPrice') ?? 0)
  const maxPrice = Number(searchParams.get('maxPrice') ?? 1000)

  const { products, loading } = useProducts()

  const specificProducts = useMemo(() => {
    return products.filter((item) => {
      if (sale && item.discount <= 0) return false
      if (arrival && !item.isNew) return false
      if (style && item.style !== style) return false
      if (category && item.category !== category) return false
      if (type && item.type !== type) return false

      if (item.price < minPrice) return false
      if (item.price > maxPrice) return false

      if (color && !item.colors.includes(color)) return false
      if (size && !item.sizes.includes(size)) return false

      // Search Filter
      if (search) {
        const searchable = [
          item.title,
          item.brand,
          item.category,
          item.type,
          item.style,
          ...(item.colors || []),
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()

        const keywords = search.split(/\s+/).filter(Boolean)

        if (!keywords.every((word) => searchable.includes(word))) {
          return false
        }
      }

      return true
    })
  }, [products, sale, arrival, style, category, type, minPrice, maxPrice, color, size, search])

  if (loading) {
    return <LoadingSpinner />
  }
  
  return (
    <>
      <div className=" h-fit">
        <Header DressingStyle={category ?? undefined} />

        <div className="mx-auto hidden max-w-310 gap-8 xl:flex">
          <aside className="sticky top-24 h-[calc(100vh-6rem)] w-[300px] shrink-0 ">
            <div className="h-full overflow-y-auto">
              <DeskTopFilter product={products} />
            </div>
          </aside>

          <main className="flex-1">
            <Products
              products={specificProducts}
              lengthofProducts={specificProducts.length}
              DressingStyle={category ?? undefined}
            />
          </main>
        </div>
        <div className="xl:hidden">
          <Products
            products={specificProducts}
            lengthofProducts={specificProducts.length}
            DressingStyle={category ?? undefined}
          />
        </div>
      </div>
    </>
  )
}
