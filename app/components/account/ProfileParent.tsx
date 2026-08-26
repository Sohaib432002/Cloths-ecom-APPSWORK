'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import {
  Dashboard,
  Profiledetails,
  Orders,
  Addresses,
  PaymentMethods,
  Coupons,
  Settings,
} from '../account'

export const ProfileParent = () => {
  const searchParams = useSearchParams()

  const currentTab = searchParams.get('Tab') || 'Profile Details'

  const TabsList = [
    'Dashboard',
    'Orders',
    'Addresses',
    'Payment Methods',
    'Coupons',
    'Profile Details',
    'Settings',
  ]

  return (
    <div className="mx-auto max-w-310  py-4 ">
      {/* Mobile Tabs */}
      <div className="mb-6 lg:hidden">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {TabsList.map((item) => (
            <Link
              key={item}
              href={{
                pathname: '/account/profile',
                query: {
                  Tab: item,
                },
              }}
              className={`whitespace-nowrap rounded-full border px-5 py-2 text-sm font-medium transition-all duration-200 ${
                currentTab === item
                  ? 'border-black bg-black text-white'
                  : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {item}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Desktop Sidebar */}
        <aside className="hidden h-fit rounded-3xl border bg-white p-5 lg:sticky lg:top-24 lg:block">
          <h2 className="mb-6 text-xl font-bold">My Account</h2>

          <nav className="flex flex-col gap-2">
            {TabsList.map((item) => (
              <Link
                key={item}
                href={{
                  pathname: '/account/profile',
                  query: {
                    Tab: item,
                  },
                }}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  currentTab === item
                    ? 'bg-black text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {currentTab === 'Dashboard' && <Dashboard />}

          {currentTab === 'Orders' && <Orders />}

          {currentTab === 'Addresses' && <Addresses />}

          {currentTab === 'Payment Methods' && <PaymentMethods />}

          {currentTab === 'Coupons' && <Coupons />}

          {currentTab === 'Profile Details' && <Profiledetails />}

          {currentTab === 'Settings' && <Settings />}
        </div>
      </div>
    </div>
  )
}

export default ProfileParent
