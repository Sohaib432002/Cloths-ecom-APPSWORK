'use client'

import Herorsection from './components/home/Herorsection'
import AvalibileProducts from './components/common/AvalibileProducts'
import Customstyles from './components/home/DressStyles'

import { products } from './lib/data/products'

import Reviews from './components/home/Reviews'

export default function Home() {
  return (
    <div className="max-w-310 m-auto">
      <Herorsection />
      <AvalibileProducts headline="NEW ARRIVALS" products={products} />
      <hr className="max-w-360 border my-2 border-gray-300 mx-auto" />
      <AvalibileProducts headline="TOP SELLING" products={products} />
      <hr className="max-w-360 border my-5 border-gray-300 mx-auto" />
      <Customstyles />
      <Reviews />
    </div>
  )
}
