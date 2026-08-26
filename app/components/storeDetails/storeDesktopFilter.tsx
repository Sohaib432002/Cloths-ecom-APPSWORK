'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronDown, ChevronRight, Check } from 'lucide-react'

import { PriceSlider } from '../storeDetails/storefilterslider'

// ================= TYPES =================

type ProductType = {
  id: number
  title: string
  slug: string
  category: string
  brand: string
  price: number
  oldPrice: number | null
  discount: number
  currency: string
  rating: number
  reviews: number
  stock: number
  sku: string
  image: string
  gallery: string[]
  colors: string[]
  sizes: string[]
  style: string
  description: string
  features: string[]
  isNew: boolean
  isFeatured: boolean
  type: string
}

type Props = {
  product: ProductType[]
}

// ================= COLOR MAP =================

const colorClassMap: Record<string, string> = {
  Black: 'bg-black',

  White: 'bg-white border border-gray-300',

  Gray: 'bg-gray-500',

  Silver: 'bg-gray-300',

  Red: 'bg-red-600',

  Pink: 'bg-pink-500',

  Orange: 'bg-orange-500',

  Yellow: 'bg-yellow-400',

  Green: 'bg-green-600',

  Emerald: 'bg-emerald-500',

  Teal: 'bg-teal-500',

  Blue: 'bg-blue-600',

  Navy: 'bg-blue-900',

  Purple: 'bg-purple-600',

  Violet: 'bg-violet-600',

  Brown: 'bg-amber-800',

  Beige: 'bg-stone-200',

  Cream: 'bg-yellow-100',

  Olive: 'bg-lime-700',

  Maroon: 'bg-red-900',

  Gold: 'bg-yellow-500',
}

// ================= ACCORDION COMPONENT =================

type AccordionProps = {
  title: string

  open: boolean

  onClick: () => void

  children: React.ReactNode
}

const FilterAccordion = ({ title, open, onClick, children }: AccordionProps) => {
  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={onClick}
        className="
flex 
w-full 
items-center 
justify-between
text-left
group
"
      >
        <h3
          className="
text-lg
font-semibold
text-gray-900
group-hover:text-black
transition
"
        >
          {title}
        </h3>

        {open ? (
          <ChevronDown size={20} className="text-gray-500" />
        ) : (
          <ChevronRight size={20} className="text-gray-500" />
        )}
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

export const DeskTopFilter = ({ product }: Props) => {
  const searchParams = useSearchParams()

  // URL VALUES

  const typeParam = searchParams.get('type')

  const styleParam = searchParams.get('style')

  const colorParam = searchParams.get('color')

  const sizeParam = searchParams.get('size')

  const sale = searchParams.get('sale')

  const arrival = searchParams.get('arrival')

  const category = searchParams.get('category')

  const minPrice = Number(searchParams.get('minPrice') ?? 0)

  const maxPrice = Number(searchParams.get('maxPrice') ?? 1000)

  // STATES

  const [openSection, setOpenSection] = useState<string | null>(null)

  const [selectedType, setSelectedType] = useState(typeParam ?? '')

  const [selectedStyle, setSelectedStyle] = useState(styleParam ?? '')

  const [selectedColor, setSelectedColor] = useState(colorParam ?? '')

  const [selectedSize, setSelectedSize] = useState(sizeParam ?? '')
  const [selectminprice, setselectminprice] = useState(minPrice ?? 0)
  const [selectmaxprice, setselectmaxprice] = useState(minPrice ?? 1000)

  // ================= FILTER DATA =================

  const types = [...new Set(product.map((item) => item.type))]

  const styles = [...new Set(product.map((item) => item.style))]

  const colors = [...new Set(product.flatMap((item) => item.colors))]

  const sizes = [
    {
      name: 'Small',
      value: 'S',
    },

    {
      name: 'Medium',
      value: 'M',
    },

    {
      name: 'Large',
      value: 'L',
    },

    {
      name: 'Extra Large',
      value: 'XL',
    },
  ]

  // ================= QUERY BUILDER =================

  const createQuery = (key: string, value: string | undefined) => {
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
w-full
rounded-3xl
border
border-gray-200
bg-white
p-5
shadow-sm
transition
hover:shadow-md
"
    >
      {/* Header */}

      <div className="mb-6 flex items-center justify-between  border-gray-200  ">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Filters</h2>

          <p className="mt-1 text-sm text-gray-500">Refine your products</p>
        </div>

        <button
          onClick={clearAllFilters}
          className="
      rounded-xl
      border
      border-red-200
      bg-red-50
      px-2
      py-2
      text-[12px]
      font-semibold
      text-red-600
      transition-all
      duration-200
      hover:border-red-500
      hover:bg-red-500
      hover:text-white
      active:scale-95
    "
        >
          <i className="fa-solid fa-filter-circle-xmark" /> <br /> clear all filters
        </button>
      </div>
      {/* Categories */}

      <FilterAccordion
        title="Categories"
        open={openSection === 'category'}
        onClick={() => setOpenSection(openSection === 'category' ? null : 'category')}
      >
        <div className="space-y-3">
          {types.map((item) => (
            <Link
              key={item}
              scroll={false}
              href={createQuery('type', selectedType === item ? undefined : item)}
            >
              <div
                onClick={() => setSelectedType(selectedType === item ? '' : item)}
                className={`
flex
items-center
justify-between
cursor-pointer
rounded-xl
px-3
py-2
transition

${selectedType === item ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-600'}

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
rounded-xl
bg-gray-50
p-3
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
gap-3
"
        >
          {colors.map((color) => (
            <Link
              key={color}
              scroll={false}
              href={createQuery(
                'color',

                selectedColor === color ? undefined : color
              )}
            >
              <button
                onClick={() => setSelectedColor(selectedColor === color ? '' : color)}
                className={`

relative

h-10
w-10

rounded-full

transition-all
duration-300


hover:scale-110


${colorClassMap[color] ?? 'bg-gray-300'}


${selectedColor === color ? 'ring-2 ring-black ring-offset-2' : ''}

`}
              >
                {selectedColor === color && (
                  <Check
                    size={16}
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
          {sizes.map((size) => (
            <Link
              key={size.value}
              scroll={false}
              href={createQuery(
                'size',

                selectedSize === size.value ? undefined : size.value
              )}
            >
              <button
                onClick={() => setSelectedSize(selectedSize === size.value ? '' : size.value)}
                className={`
w-full
rounded-full
py-3
text-sm
font-medium
transition-all


${
  selectedSize === size.value
    ? 'bg-black text-white'
    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
}


`}
              >
                {size.name}
              </button>
            </Link>
          ))}
        </div>
      </FilterAccordion>

      {/* DRESSING STYLE */}

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
          {styles.map((style) => (
            <Link
              key={style}
              scroll={false}
              href={createQuery(
                'style',

                selectedStyle === style ? undefined : style
              )}
            >
              <div
                onClick={() => setSelectedStyle(selectedStyle === style ? '' : style)}
                className={`
flex
items-center
justify-between
rounded-xl
px-3
py-3
cursor-pointer
transition


${selectedStyle === style ? 'bg-black text-white' : 'hover:bg-gray-100 text-gray-600'}

`}
              >
                <span>{style}</span>

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
bg-gray-50
p-4
"
        >
          <h4
            className="
mb-3
text-sm
font-semibold
text-gray-700
"
          >
            Active Filters
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
  )
}
