'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Product } from '@/types/product'
import DressingStyleCard from './storeStyleCard'
import { MobileFilter } from './storeMobileFilter'

type Props = {
  products: Product[]
  lengthofProducts: number
  DressingStyle?: string
}

export const Products = ({ products, lengthofProducts }: Props) => {
  const [showFilter, setShowFilter] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const PRODUCTS_PER_PAGE = 18
  const currentPage = Number(searchParams.get('page')) || 1
  const visibleProducts = products
  const totalPages = Math.max(1, Math.ceil(lengthofProducts / PRODUCTS_PER_PAGE))
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const showingFrom = lengthofProducts === 0 ? 0 : startIndex + 1
  const showingTo = Math.min(startIndex + products.length, lengthofProducts)

  const changePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())

    params.set('page', page.toString())

    router.replace(`${pathname}?${params.toString()}`, {
      scroll: false,
    })
  }

  useEffect(() => {
    const maxPage = Math.ceil(lengthofProducts / PRODUCTS_PER_PAGE)
    if (currentPage > maxPage && maxPage > 0) {
      changePage(1)
    }
  }, [lengthofProducts])

  const getPageNumbers = () => {
    const pages: (number | string)[] = []

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    pages.push(1)

    let start = Math.max(currentPage - 1, 2)
    let end = Math.min(currentPage + 1, totalPages - 1)

    if (currentPage <= 3) {
      start = 2
      end = 4
    }

    if (currentPage >= totalPages - 2) {
      start = totalPages - 3
      end = totalPages - 1
    }

    if (start > 2) {
      pages.push('...')
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < totalPages - 1) {
      pages.push('...')
    }

    pages.push(totalPages)

    return pages
  }
  const handleClearFilters = () => {
    router.push('/Store')
  }
  return (
    <>
      {' '}
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex flex-1 justify-between">
          <div className="flex-1">
            <h2 className="text-xl font-bold sm:text-2xl">{lengthofProducts} Products</h2>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Showing {showingFrom}-{showingTo} of {lengthofProducts} Products
            </p>
          </div>
        </div>

        {/* Mobile Filter Button */}
        <div className="xl:hidden shrink-0">
          <button
            onClick={() => setShowFilter(true)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition hover:bg-gray-200"
          >
            <i className="fa-solid fa-sliders rotate-90 text-sm"></i>
          </button>
        </div>
      </div>
      {/* Mobile Overlay */}
      <div
        onClick={() => setShowFilter(false)}
        className={`fixed inset-0 z-50 mx-3 bg-black/40   transition-all duration-300 ${
          showFilter ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        {/* Bottom Sheet */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`absolute bottom-0 left-0 mx-1 right-0 h-[85vh]  rounded-t-3xl  transition-transform duration-300 ${
            showFilter ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <MobileFilter products={products} setShowFilter={setShowFilter} />
        </div>
      </div>
      {/* Products */}
      <div className="flex flex-col justify-between">
        <div
          className="
          grid
          grid-cols-2
          gap-1

          sm:grid-cols-2
          sm:gap-3

          lg:grid-cols-3
          lg:gap-5
        "
        >
          {lengthofProducts !== 0 &&
            visibleProducts.map((item) => (
              <div
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation()
                  router.push(`/ProductDetails/${item.slug}`)
                }}
                className="cursor-pointer"
              >
                <DressingStyleCard
                  id={item.id}
                  slug={item.slug}
                  image={item.image}
                  title={item.title}
                  price={item.price}
                  rating={item.rating}
                  discount={item.discount}
                  sizes={item.sizes}
                  colors={item.colors}
                  stock={item.stock}
                />
              </div>
            ))}
        </div>
      </div>{' '}
      {/* Empty State */}
      {lengthofProducts === 0 && (
        <div className="col-span-2 lg:col-span-3 flex min-h-[300px] items-center justify-center">
          <div className="rounded-2xl bg-gray-100 px-6 py-8 text-center shadow-sm">
            <div className="mb-3 text-5xl">😔</div>

            <h3 className="text-lg font-semibold text-gray-800">No Products Found</h3>

            <p className="mt-2 text-sm text-gray-500">
              We couldn&apos;t find any products matching your filters.
            </p>
          </div>
        </div>
      )}
      {/* Pagination */}
      {lengthofProducts > PRODUCTS_PER_PAGE && (
        <div className="mt-8 flex items-center justify-center pb-8">
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Previous */}
            <button
              onClick={() => changePage(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
              className="
                flex
                h-9
                items-center
                justify-center
                rounded-lg
                border
                border-gray-300
                px-3
                text-sm
                transition
                hover:bg-gray-100
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <span className="hidden sm:block">Previous</span>

              <span className="sm:hidden">
                <i className="fa-solid fa-chevron-left"></i>
              </span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1 sm:gap-2">
              {getPageNumbers().map((page, index) =>
                page === '...' ? (
                  <span key={`dots-${index}`} className="px-1 text-sm">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => changePage(page as number)}
                    className={`
                      h-9
                      w-9
                      rounded-lg
                      text-sm
                      font-medium
                      transition

                      ${currentPage === page ? 'bg-black text-white' : 'hover:bg-gray-100'}
                    `}
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            {/* Next */}
            <button
              onClick={() => changePage(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="
                flex
                h-9
                items-center
                justify-center
                rounded-lg
                border
                border-gray-300
                px-3
                text-sm
                transition
                hover:bg-gray-100
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <span className="hidden sm:block">Next</span>

              <span className="sm:hidden">
                <i className="fa-solid fa-chevron-right"></i>
              </span>
            </button>
          </div>
        </div>
      )}{' '}
      {/* Products Grid */}
    </>
  )
}

export default Products
