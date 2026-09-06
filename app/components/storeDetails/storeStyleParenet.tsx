'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { DeskTopFilter, Header, Products } from '../storeDetails'
import { LoadingSpinner } from '../common/Spinner'
import type { Product } from '@/types/product'

type CatalogResponse = {
  products: Product[]
  total: number
  totalPages: number
  page: number
}

export const DressingStyleParenet = () => {
  const searchParams = useSearchParams()
  const [data, setData] = useState<CatalogResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    if (!params.get('limit')) params.set('limit', '18')
    const controller = new AbortController()
    setLoading(true)
    fetch(`/api/products?${params.toString()}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((payload) => setData(payload))
      .catch(() => setData({ products: [], total: 0, totalPages: 1, page: 1 }))
      .finally(() => setLoading(false))
    return () => controller.abort()
  }, [searchParams])

  if (loading && !data) {
    return <LoadingSpinner text="Loading catalog..." />
  }

  const products = data?.products || []
  const category = searchParams.get('category') ?? undefined

  return (
    <div className="h-fit">
      <Header DressingStyle={category} />
      <div className="mx-auto hidden max-w-310 gap-8 xl:flex">
        <aside className="sticky top-24 h-[calc(100vh-6rem)] w-[300px] shrink-0">
          <div className="h-full overflow-y-auto">
            <DeskTopFilter product={products} />
          </div>
        </aside>
        <main className="flex-1">
          <Products products={products} lengthofProducts={data?.total || 0} DressingStyle={category} />
        </main>
      </div>
      <div className="xl:hidden">
        <Products products={products} lengthofProducts={data?.total || 0} DressingStyle={category} />
      </div>
    </div>
  )
}
