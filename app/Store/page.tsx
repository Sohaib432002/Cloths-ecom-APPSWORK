import { Suspense } from 'react'
import { DressingStyleParenet } from '../components/storeDetails/storeStyleParenet'

export default function Page() {
  return (
    <div className="lg:max-w-310 mx-auto">
      <Suspense fallback={<div>Loading...</div>}>
        <DressingStyleParenet />
      </Suspense>
    </div>
  )
}
