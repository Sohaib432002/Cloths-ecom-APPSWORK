import Link from 'next/link'

export default function AccountPage() {
  const accountItems = [
    {
      title: 'My Profile',
      description: 'Manage your personal information',
      href: '/account/profile?Tab=Profile Details',
      icon: 'fa-regular fa-user',
    },
    {
      title: 'Dashboard',
      description: 'View your account overview',
      href: '/account/profile?Tab=Dashboard',
      icon: 'fa-solid fa-table-columns',
    },
    {
      title: 'Orders',
      description: 'Track and manage your orders',
      href: '/account/profile?Tab=Orders',
      icon: 'fa-solid fa-box',
    },
    {
      title: 'Wishlists',
      description: 'Products you saved for later',
      href: '/account/profile?Tab=Wishlists',
      icon: 'fa-regular fa-heart',
    },
    {
      title: 'Addresses',
      description: 'Manage shipping addresses',
      href: '/account/profile?Tab=Addresses',
      icon: 'fa-solid fa-location-dot',
    },
    {
      title: 'Payment Methods',
      description: 'Cards and payment options',
      href: '/account/profile?Tab=Payment Methods',
      icon: 'fa-regular fa-credit-card',
    },
    {
      title: 'Coupons',
      description: 'Available discount coupons',
      href: '/account/profile?Tab=Coupons',
      icon: 'fa-solid fa-ticket',
    },
    {
      title: 'Notifications',
      description: 'View all notifications',
      href: '/account/profile?Tab=Notifications',
      icon: 'fa-regular fa-bell',
    },
    {
      title: 'Settings',
      description: 'Update account preferences',
      href: '/account/profile?Tab=Settings',
      icon: 'fa-solid fa-gear',
    },
  ]

  return (
    <div className="max-w-310 mx-auto  py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-black">My Account</h1>

        <p className="mt-2 text-gray-500">
          Manage your profile, orders, addresses, payments and account settings.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {accountItems.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="rounded-3xl border p-6 transition hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white">
                <i className={`${item.icon} text-xl`} />
              </div>

              <div>
                <h2 className="text-xl font-bold">{item.title}</h2>

                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <span className="font-medium">Open</span>

              <i className="fa-solid fa-arrow-right" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
