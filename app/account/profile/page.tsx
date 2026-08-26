import { Suspense } from 'react'
import { ProfileParent } from '../../components/account'

export default function ProfilePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileParent />
    </Suspense>
  )
}
