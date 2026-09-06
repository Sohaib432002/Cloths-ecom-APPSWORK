'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { X, ChevronDown, ChevronRight, Check, Filter, RotateCcw } from 'lucide-react'

import { Product } from '@/types/product'
import { PriceSlider } from '../storeDetails/storefilterslider'
import { CATALOG_FACETS } from '@/lib/catalog/facets'
type Props = {
  products: Pick<Product, 'id' | 'title' | 'type' | 'style' | 'colors'>[]

  setShowFilter: React.Dispatch<React.SetStateAction<boolean>>
}
// ================= TYPES =================

// ================= COLOR MAP =================

const colorClassMap: Record<string, string> = {
  Black: 'bg-black',

  White: 'bg-white border border-gray-300',

  Gray: 'bg-gray-500',

  Silver: 'bg-gray-300',

  Red: 'bg-red-600',

  Pink: 'bg-pink-500',

  Rose: 'bg-rose-500',

  Orange: 'bg-orange-500',

  Amber: 'bg-amber-500',

  Yellow: 'bg-yellow-400',

  Lime: 'bg-lime-500',

  Green: 'bg-green-600',

  Emerald: 'bg-emerald-500',

  Teal: 'bg-teal-500',

  Cyan: 'bg-cyan-500',

  Sky: 'bg-sky-500',

  Blue: 'bg-blue-600',

  Indigo: 'bg-indigo-600',

  Violet: 'bg-violet-600',

  Purple: 'bg-purple-600',

  Fuchsia: 'bg-fuchsia-500',

  Brown: 'bg-amber-800',

  Beige: 'bg-stone-200',

  Cream: 'bg-yellow-100',

  Navy: 'bg-blue-900',

  Olive: 'bg-lime-700',

  Maroon: 'bg-red-900',

  Gold: 'bg-yellow-500',
}

// ================= SIZE OPTIONS =================

const SizeOptions = [
  {
    id: 1,
    name: 'Small',
    value: 'S',
  },

  {
    id: 2,
    name: 'Medium',
    value: 'M',
  },

  {
    id: 3,
    name: 'Large',
    value: 'L',
  },

  {
    id: 4,
    name: 'Extra Large',
    value: 'XL',
  },
]

// ================= ACCORDION =================

type AccordionProps = {
  title: string

  open: boolean

  onClick: () => void

  children: React.ReactNode
}

const FilterAccordion = ({
  title,

  open,

  onClick,

  children,
}: AccordionProps) => {
  return (
    <div
      className="
border-b
border-gray-200

py-4
"
    >
      <button
        onClick={onClick}
        className="
flex
w-full
items-center
justify-between
"
      >
        <h3
          className="
text-lg
font-semibold
text-black
"
        >
          {title}
        </h3>

        {open ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </button>

      <div
        className={`
overflow-hidden
transition-all
duration-500

${open ? 'max-h-[500px] opacity-100 mt-4' : 'max-h-0 opacity-0'}

`}
      >
        {children}
      </div>
    </div>
  )
}

// ================= MAIN COMPONENT =================

export const MobileFilter = ({
  products,

  setShowFilter,
}: Props) => {
  const searchParams = useSearchParams()

  // URL VALUES

  const sale = searchParams.get('sale')

  const arrival = searchParams.get('arrival')

  const category = searchParams.get('category')

  const type = searchParams.get('type')

  const style = searchParams.get('style')

  const color = searchParams.get('color')

  const size = searchParams.get('size')

  const minPrice = Number(searchParams.get('minPrice') ?? 0)

  const maxPrice = Number(searchParams.get('maxPrice') ?? 1000)

  // STATES

  const [openSection, setOpenSection] = useState<string | null>(null)

  const [selectedType, setSelectedType] = useState(type ?? '')

  const [selectedStyle, setSelectedStyle] = useState(style ?? '')

  const [selectedColor, setSelectedColor] = useState(color ?? '')

  const [selectedSize, setSelectedSize] = useState(size ?? '')

  // FILTER DATA

  const types = CATALOG_FACETS.types
  const styles = CATALOG_FACETS.styles
  const colors = CATALOG_FACETS.colors

  // QUERY BUILDER
  const [selectminprice, setselectminprice] = useState(minPrice ?? 0)
  const [selectmaxprice, setselectmaxprice] = useState(maxPrice ?? 1000)

  const createQuery = (
    key: string,

    value: string | undefined
  ) => {
    return {
      pathname: '/Store',

      query: {
        type: selectedType || undefined,

        style: selectedStyle || undefined,

        color: selectedColor || undefined,

        size: selectedSize || undefined,

        sale,

        arrival,

        category,

        minPrice: selectminprice,

        maxPrice: selectmaxprice,

        [key]: value,
      },
    }
  }
  const router = useRouter()
  const clearAllFilters = () => {
    setSelectedType('')
    setSelectedStyle('')
    setSelectedColor('')
    setSelectedSize('')
    setselectminprice(0)
    setselectmaxprice(1000)
    setOpenSection(null)

    router.replace('/Store', { scroll: false })
  }
  return (
    <div
      className="
fixed
inset-0
z-50
bg-black/5
bg-blend-screen
xl:hidden
"
    >
      <div
        className="
absolute
right-0
top-0
h-full
w-full
overflow-y-auto
rounded-l-3xl
bg-white
p-5
shadow-xl
animate-slideIn
"
      >
        {/* HEADER */}

        <div className="mb-6 rounded-3xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            {/* Left Side */}
            <div>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black text-white">
                  <Filter size={18} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900 sm:text-xl">Product Filters</h2>

                  <p className="text-sm text-gray-500">Find your perfect product</p>
                </div>
              </div>

              <button
                onClick={clearAllFilters}
                className="
          mt-2
          flex
          items-center
          gap-2
          rounded-xl
          border
          border-red-200
          bg-red-50
          px-4
          py-2
          text-sm
          font-semibold
          text-red-600
          transition-all
          duration-300
          hover:border-red-500
          hover:bg-red-500
          hover:text-white
          active:scale-95
        "
              >
                <RotateCcw size={16} />
                Clear All Filters
              </button>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowFilter(false)}
              className="
        flex
        h-11
        w-11
        items-center
        justify-center
        rounded-2xl
        border
        border-gray-200
        bg-white
        text-gray-600
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-black
        hover:bg-black
        hover:text-white
        active:scale-95
      "
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* CATEGORY */}

        <FilterAccordion
          title="Categories"
          open={openSection === 'category'}
          onClick={() => setOpenSection(openSection === 'category' ? null : 'category')}
        >
          <div
            className="
space-y-2
"
          >
            {types.map((item) => (
              <Link
                key={item}
                scroll={false}
                href={createQuery(
                  'type',

                  selectedType === item ? undefined : item
                )}
              >
                <div
                  onClick={() => setSelectedType(selectedType === item ? '' : item)}
                  className={`

flex
cursor-pointer
items-center
justify-between
rounded-xl
px-3
py-3
transition


${selectedType === item ? 'bg-black text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}

`}
                >
                  <span>{item}</span>

                  <ChevronRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </FilterAccordion>

        {/* PRICE */}

        <FilterAccordion
          title="Price"
          open={openSection === 'price'}
          onClick={() => setOpenSection(openSection === 'price' ? null : 'price')}
        >
          <div
            className="
rounded-2xl
bg-gray-50
p-4
"
          >
            <PriceSlider />
          </div>
        </FilterAccordion>

        {/* COLORS */}

        <FilterAccordion
          title="Colors"
          open={openSection === 'color'}
          onClick={() => setOpenSection(openSection === 'color' ? null : 'color')}
        >
          <div
            className="
flex
flex-wrap
gap-4
"
          >
            {colors.map((item) => (
              <Link
                key={item}
                scroll={false}
                href={createQuery(
                  'color',

                  selectedColor === item ? undefined : item
                )}
              >
                <button
                  onClick={() => setSelectedColor(selectedColor === item ? '' : item)}
                  className={`

relative
h-11
w-11
rounded-full
transition-all
duration-300


hover:scale-110


${colorClassMap[item] ?? 'bg-gray-300'}


${selectedColor === item ? 'ring-2 ring-black ring-offset-2' : ''}

`}
                >
                  {selectedColor === item && (
                    <Check
                      size={17}
                      className="
absolute
left-1/2
top-1/2
-translate-x-1/2
-translate-y-1/2
text-white
"
                    />
                  )}
                </button>
              </Link>
            ))}
          </div>
        </FilterAccordion>

        {/* SIZE */}

        <FilterAccordion
          title="Size"
          open={openSection === 'size'}
          onClick={() => setOpenSection(openSection === 'size' ? null : 'size')}
        >
          <div
            className="
grid
grid-cols-2
gap-3
"
          >
            {SizeOptions.map((item) => (
              <Link
                key={item.id}
                scroll={false}
                href={createQuery(
                  'size',

                  selectedSize === item.value ? undefined : item.value
                )}
              >
                <button
                  onClick={() => setSelectedSize(selectedSize === item.value ? '' : item.value)}
                  className={`

w-full
rounded-full
py-3
text-sm
font-medium
transition


${
  selectedSize === item.value
    ? 'bg-black text-white'
    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
}

`}
                >
                  {item.name}
                </button>
              </Link>
            ))}
          </div>
        </FilterAccordion>

        {/* STYLE */}

        <FilterAccordion
          title="Dressing Style"
          open={openSection === 'style'}
          onClick={() => setOpenSection(openSection === 'style' ? null : 'style')}
        >
          <div
            className="
space-y-2
"
          >
            {styles.map((item) => (
              <Link
                key={item}
                scroll={false}
                href={createQuery(
                  'style',

                  selectedStyle === item ? undefined : item
                )}
              >
                <div
                  onClick={() => setSelectedStyle(selectedStyle === item ? '' : item)}
                  className={`

flex
cursor-pointer
items-center
justify-between
rounded-xl
px-3
py-3
transition


${selectedStyle === item ? 'bg-black text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}

`}
                >
                  <span>{item}</span>

                  <ChevronRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </FilterAccordion>

        {/* ACTIVE FILTERS */}

        {(selectedType || selectedColor || selectedSize || selectedStyle) && (
          <div
            className="
mt-5
rounded-2xl
bg-gray-100
p-4
"
          >
            <h4
              className="
mb-3
text-sm
font-semibold
"
            >
              Selected Filters
            </h4>

            <div
              className="
flex
flex-wrap
gap-2
"
            >
              {[selectedType, selectedColor, selectedSize, selectedStyle]
                .filter(Boolean)
                .map((item) => (
                  <span
                    key={item}
                    className="
rounded-full
bg-black
px-3
py-1
text-xs
text-white
"
                  >
                    {item}
                  </span>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
