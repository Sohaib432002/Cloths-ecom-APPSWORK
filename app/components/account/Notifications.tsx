'use client'

import { useState } from 'react'

type Notification = {
  id: number
  title: string
  message: string
  time: string
  isRead: boolean
}

export const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'Order Delivered',
      message: 'Your order #ORD-458921 has been delivered successfully.',
      time: '2 hours ago',
      isRead: false,
    },
    {
      id: 2,
      title: 'Payment Successful',
      message: 'Your payment of $149.99 has been received.',
      time: 'Yesterday',
      isRead: true,
    },
    {
      id: 3,
      title: 'New Coupon Available',
      message: 'You have received a 20% OFF coupon for your next purchase.',
      time: '2 days ago',
      isRead: false,
    },
    {
      id: 4,
      title: 'Wishlist Reminder',
      message: 'One of your wishlist items is now on sale.',
      time: '3 days ago',
      isRead: true,
    },
    {
      id: 5,
      title: 'Account Security',
      message: 'Your account password was changed successfully.',
      time: 'Last week',
      isRead: true,
    },
  ])

  const markAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              isRead: true,
            }
          : item
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((item) => ({
        ...item,
        isRead: true,
      }))
    )
  }

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter((item) => !item.isRead).length

  return (
    <div
      className="
    col-span-3
    p-3
    sm:p-5
    lg:p-8
    "
    >
      {/* Header */}

      <div
        className="
      flex
      flex-col
      gap-4
      mb-5
      sm:mb-8
      md:flex-row
      md:items-center
      md:justify-between
      "
      >
        <div>
          <h1
            className="
          text-xl
          sm:text-3xl
          font-bold
          "
          >
            Notifications
          </h1>

          <p
            className="
          mt-1
          sm:mt-2
          text-sm
          sm:text-base
          text-gray-500
          "
          >
            Stay updated with your latest account activities.
          </p>

          <p
            className="
          mt-2
          text-xs
          sm:text-sm
          font-medium
          text-blue-600
          "
          >
            {unreadCount} Unread Notification
            {unreadCount !== 1 && 's'}
          </p>
        </div>

        <div
          className="
        flex
        flex-col
        sm:flex-row
        gap-2
        sm:gap-3
        "
        >
          <button
            onClick={markAllAsRead}
            className="
          rounded-full
          bg-black
          px-4
          sm:px-6
          py-2
          sm:py-3
          text-sm
          sm:text-base
          text-white
          hover:bg-gray-800
          transition
          "
          >
            Mark All as Read
          </button>

          <button
            onClick={clearAll}
            className="
          rounded-full
          border
          border-red-500
          px-4
          sm:px-6
          py-2
          sm:py-3
          text-sm
          sm:text-base
          text-red-500
          hover:bg-red-500
          hover:text-white
          transition
          "
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Notifications List */}

      <div
        className="
      space-y-3
      sm:space-y-5
      "
      >
        {notifications.map((item) => (
          <div
            key={item.id}
            className={`

        rounded-xl
        sm:rounded-2xl

        border

        p-3
        sm:p-6

        transition-all

        hover:shadow-lg


        ${item.isRead ? 'border-gray-200 bg-white' : 'border-blue-300 bg-blue-50'}

        `}
          >
            <div
              className="
        flex
        flex-col
        gap-4
        lg:flex-row
        lg:items-start
        lg:justify-between
        "
            >
              {/* Left Content */}

              <div
                className="
        flex
        gap-3
        sm:gap-4
        flex-1
        "
              >
                <div
                  className={`

          h-10
          w-10
          sm:h-14
          sm:w-14

          rounded-full

          flex
          items-center
          justify-center

          text-base
          sm:text-xl


          ${item.isRead ? 'bg-gray-200 text-gray-600' : 'bg-blue-600 text-white'}

          `}
                >
                  <i className="fa-solid fa-bell"></i>
                </div>

                <div className="flex-1">
                  <div
                    className="
            flex
            flex-wrap
            items-center
            gap-2
            sm:gap-3
            "
                  >
                    <h2
                      className="
              text-base
              sm:text-xl
              font-bold
              "
                    >
                      {item.title}
                    </h2>

                    {!item.isRead && (
                      <span
                        className="
                rounded-full
                bg-blue-600
                px-2
                sm:px-3
                py-1
                text-[10px]
                sm:text-xs
                font-semibold
                text-white
                "
                      >
                        New
                      </span>
                    )}
                  </div>

                  <p
                    className="
            mt-1
            sm:mt-2
            text-sm
            sm:text-base
            text-gray-600
            "
                  >
                    {item.message}
                  </p>

                  <p
                    className="
            mt-2
            sm:mt-3
            text-xs
            sm:text-sm
            text-gray-400
            "
                  >
                    {item.time}
                  </p>
                </div>
              </div>

              {/* Actions */}

              <div
                className="
        flex
        flex-wrap
        gap-2
        "
              >
                {!item.isRead && (
                  <button
                    onClick={() => markAsRead(item.id)}
                    className="
          rounded-full
          border
          border-blue-600
          px-3
          sm:px-5
          py-1.5
          sm:py-2
          text-xs
          sm:text-sm
          text-blue-600
          hover:bg-blue-600
          hover:text-white
          transition
          "
                  >
                    Mark as Read
                  </button>
                )}

                <button
                  onClick={() => deleteNotification(item.id)}
                  className="
          rounded-full
          border
          border-red-500
          px-3
          sm:px-5
          py-1.5
          sm:py-2
          text-xs
          sm:text-sm
          text-red-500
          hover:bg-red-500
          hover:text-white
          transition
          "
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}

      {notifications.length === 0 && (
        <div
          className="
        rounded-2xl
        sm:rounded-3xl
        border
        border-dashed
        py-10
        sm:py-20
        text-center
        "
        >
          <div
            className="
          mx-auto
          flex
          h-16
          w-16
          sm:h-24
          sm:w-24
          items-center
          justify-center
          rounded-full
          bg-gray-100
          "
          >
            <i
              className="
            fa-regular
            fa-bell-slash
            text-3xl
            sm:text-5xl
            text-gray-400
            "
            ></i>
          </div>

          <h2
            className="
          mt-4
          sm:mt-6
          text-xl
          sm:text-3xl
          font-bold
          text-gray-800
          "
          >
            No Notifications
          </h2>

          <p
            className="
          mx-auto
          mt-2
          sm:mt-3
          max-w-md
          px-4
          text-sm
          sm:text-base
          text-gray-500
          "
          >
            You're all caught up! New order updates, payment confirmations, security alerts and
            promotional notifications will appear here.
          </p>
        </div>
      )}
    </div>
  )
}
