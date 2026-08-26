import { Suspense } from 'react'
import { ProductDetailsParaent } from '@/app/components/ProductDetails/ProductDetailsParaent'

type Props = {
  params: Promise<{
    ProductSlug: string
  }>
}

export default async function Page({ params }: Props) {
  const { ProductSlug } = await params

  return (
    <div className="mx-5">
      <Suspense fallback={<div>Loading...</div>}>
        <ProductDetailsParaent productslug={ProductSlug} />
      </Suspense>
    </div>
  )
}
