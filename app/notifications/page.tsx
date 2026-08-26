'use client'

import { useMemo, useState } from 'react'
import {
  Bell,
  CheckCheck,
  ShoppingBag,
  Truck,
  BadgePercent,
  Heart,
  PackageCheck,
  Sparkles,
} from 'lucide-react'

type NotificationType = 'order' | 'shipping' | 'discount' | 'wishlist' | 'delivery' | 'collection'

type NotificationItem = {
  id: number
  title: string
  description: string
  time: string
  type: NotificationType
  read: boolean
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 1,
      title: 'Order Confirmed',
      description: 'Your order #SH1024 has been confirmed successfully.',
      time: '2 min ago',
      type: 'order',
      read: false,
    },

    {
      id: 2,
      title: 'Package Shipped',
      description: 'Your package is on the way and will arrive soon.',
      time: '20 min ago',
      type: 'shipping',
      read: false,
    },

    {
      id: 3,
      title: '20% OFF Sale',
      description: 'Use code FIRST20 and enjoy an exclusive discount.',
      time: '1 hour ago',
      type: 'discount',
      read: true,
    },

    {
      id: 4,
      title: 'Wishlist Update',
      description: 'A product from your wishlist is back in stock.',
      time: 'Yesterday',
      type: 'wishlist',
      read: true,
    },

    {
      id: 5,
      title: 'Delivered Successfully',
      description: 'Your recent order has been delivered successfully.',
      time: '2 days ago',
      type: 'delivery',
      read: true,
    },

    {
      id: 6,
      title: 'New Collection',
      description: 'Explore our latest premium fashion collection.',
      time: '3 days ago',
      type: 'collection',
      read: false,
    },
  ])

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  )

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        read: true,
      }))
    )
  }

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'order':
        return <ShoppingBag size={20} />

      case 'shipping':
        return <Truck size={20} />

      case 'discount':
        return <BadgePercent size={20} />

      case 'wishlist':
        return <Heart size={20} />

      case 'delivery':
        return <PackageCheck size={20} />

      case 'collection':
        return <Sparkles size={20} />

      default:
        return <Bell size={20} />
    }
  }

  return (
    <section className="mx-auto w-full max-w-310  py-8  ">
      {/* Header */}

      <div className="mb-8 rounded-3xl border border-gray-200 bg-gradient-to-r from-white via-gray-50 to-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-black text-white shadow-lg">
              <Bell size={26} />
            </div>

            <div>
              <h1 className="text-2xl font-black text-gray-900 sm:text-3xl">Notifications</h1>

              <p className="mt-1 text-sm text-gray-500 sm:text-base">
                Stay updated with your latest activities.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-2xl bg-black px-5 py-3 text-white shadow-lg">
              <p className="text-xs uppercase tracking-wider text-gray-300">Unread</p>

              <h2 className="text-2xl font-black">{unreadCount}</h2>
            </div>

            <button
              onClick={markAllAsRead}
              className="
                flex
                items-center
                gap-2
                rounded-2xl
                border
                border-gray-300
                bg-white
                px-5
                py-3
                font-semibold
                text-gray-700
                transition-all
                duration-300
                hover:border-black
                hover:bg-black
                hover:text-white
              "
            >
              <CheckCheck size={18} />
              Mark All Read
            </button>
          </div>
        </div>
      </div>

      {/* Notifications List */}

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`
        group
        relative
        overflow-hidden
        rounded-3xl
        border
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
        ${notification.read ? 'border-gray-200' : 'border-black/10 bg-gray-50'}
      `}
            >
              {/* Unread Indicator */}

              {!notification.read && (
                <span className="absolute right-5 top-5 h-3 w-3 rounded-full bg-green-500 ring-4 ring-green-100" />
              )}

              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                {/* Icon */}

                <div
                  className="
            flex
            h-14
            w-14
            shrink-0
            items-center
            justify-center
            rounded-2xl
            bg-black
            text-white
            shadow-md
            transition-transform
            duration-300
            group-hover:scale-110
          "
                >
                  {getIcon(notification.type)}
                </div>

                {/* Content */}

                <div className="flex-1">
                  <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-black">
                        {notification.title}
                      </h2>

                      <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-[15px]">
                        {notification.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                        {notification.time}
                      </span>

                      {!notification.read && (
                        <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                          New
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Bottom */}

                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      className="
                rounded-xl
                bg-black
                px-5
                py-2.5
                text-sm
                font-semibold
                text-white
                transition-all
                duration-300
                hover:bg-gray-800
              "
                    >
                      View Details
                    </button>

                    {!notification.read && (
                      <button
                        onClick={() =>
                          setNotifications((prev) =>
                            prev.map((item) =>
                              item.id === notification.id
                                ? {
                                    ...item,
                                    read: true,
                                  }
                                : item
                            )
                          )
                        }
                        className="
                  rounded-xl
                  border
                  border-gray-300
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  transition-all
                  duration-300
                  hover:border-black
                  hover:bg-black
                  hover:text-white
                "
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-gray-50 px-6 py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black text-white shadow-lg">
              <Bell size={36} />
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-900">No Notifications</h2>

            <p className="mt-3 max-w-md text-sm leading-6 text-gray-500 sm:text-base">
              You're all caught up! New notifications about your orders, shipping updates,
              discounts, and promotions will appear here.
            </p>

            <button
              onClick={() => window.location.reload()}
              className="
      mt-8
      rounded-2xl
      bg-black
      px-8
      py-3
      text-sm
      font-semibold
      text-white
      transition-all
      duration-300
      hover:-translate-y-1
      hover:bg-gray-800
      hover:shadow-xl
    "
            >
              Refresh
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
