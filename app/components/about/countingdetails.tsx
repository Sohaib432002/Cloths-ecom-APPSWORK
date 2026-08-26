'use client'

import CountUp from 'react-countup'
import { useInView } from 'react-intersection-observer'

export default function StatsSection() {
  const { ref, inView } = useInView({
    triggerOnce: true, // sirf ek baar animation chale
    threshold: 0.3,
  })

  return (
    <div ref={ref} className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-3xl bg-white py-4 text-center shadow-lg">
        <h3 className="text-3xl font-black">
          {inView && <CountUp end={1000} duration={2} separator="," />}+
        </h3>
        <p className="mt-3 text-gray-500">Happy Customers</p>
      </div>

      <div className="rounded-3xl bg-white py-4 text-center shadow-lg">
        <h3 className="text-3xl font-black">
          {inView && <CountUp end={5000} duration={2} separator="," />}+
        </h3>
        <p className="mt-3 text-gray-500">Premium Products</p>
      </div>

      <div className="rounded-3xl bg-white py-4 text-center shadow-lg">
        <h3 className="text-3xl font-black">{inView && <CountUp end={50} duration={2} />}+</h3>
        <p className="mt-3 text-gray-500">Global Brands</p>
      </div>

      <div className="rounded-3xl bg-white py-4 text-center shadow-lg">
        <h3 className="text-3xl font-black">{inView && <CountUp end={99} duration={2} />}%</h3>
        <p className="mt-3 text-gray-500">Customer Satisfaction</p>
      </div>
    </div>
  )
}
