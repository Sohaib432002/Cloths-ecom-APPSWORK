import ProductCard from '../common/ProductCard'
import SectionHeading from './SectionHeading'
import type { Product } from '@/types/product'

export default function ProductRail({
  eyebrow,
  headline,
  products,
  href,
  linkLabel = 'View All Products',
  id,
}: {
  eyebrow: string
  headline: React.ReactNode
  products: Product[]
  href: string
  linkLabel?: string
  id?: string
}) {
  return (
    <section id={id} className="mx-auto max-w-310 scroll-mt-24">
      <SectionHeading eyebrow={eyebrow} title={headline} href={href} linkLabel={linkLabel} />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {products.map((item) => (
          <ProductCard
            key={item.id}
            id={item.id}
            slug={item.slug}
            image={item.image}
            title={item.title}
            price={item.price}
            oldPrice={item.oldPrice}
            rating={item.rating}
            reviews={item.reviews}
            discount={item.discount}
            sizes={item.sizes}
            colors={item.colors}
            stock={item.stock}
            category={item.category}
          />
        ))}
      </div>
    </section>
  )
}
