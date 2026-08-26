'use client'

import { useState } from 'react'

export const Settings = () => {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [language, setLanguage] = useState('English')
  const [currency, setCurrency] = useState('USD')

  return (
    <div
      className="
      col-span-3
      px-3
      sm:px-5
      py-3
      sm:py-5
      "
    >
      <h1
        className="
        text-2xl
        sm:text-3xl
        lg:text-4xl
        font-bold
        mb-5
        sm:mb-8
        "
      >
        Settings
      </h1>

      <div
        className="
        space-y-3
        sm:space-y-5
        "
      >
        {/* Appearance */}

        <div
          className="
        border
        rounded-2xl
        sm:rounded-3xl
        p-4
        sm:p-6
        "
        >
          <h2
            className="
          text-lg
          sm:text-2xl
          font-bold
          mb-4
          sm:mb-5
          "
          >
            Appearance
          </h2>

          <div
            className="
          flex
          items-center
          justify-between
          gap-3
          "
          >
            <div>
              <p
                className="
              text-sm
              sm:text-base
              font-semibold
              "
              >
                Dark Mode
              </p>

              <p
                className="
              text-xs
              sm:text-sm
              text-gray-500
              "
              >
                Enable dark theme for the website.
              </p>
            </div>

            <input
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="
          h-4
          w-4
          sm:h-5
          sm:w-5
          "
            />
          </div>
        </div>

        {/* Notifications */}

        <div
          className="
        border
        rounded-2xl
        sm:rounded-3xl
        p-4
        sm:p-6
        "
        >
          <h2
            className="
          text-lg
          sm:text-2xl
          font-bold
          mb-4
          sm:mb-5
          "
          >
            Notifications
          </h2>

          <div className="space-y-4 sm:space-y-5">
            <div
              className="
            flex
            items-center
            justify-between
            gap-3
            "
            >
              <div>
                <p className="text-sm sm:text-base font-semibold">Email Notifications</p>

                <p className="text-xs sm:text-sm text-gray-500">
                  Receive order and promotional emails.
                </p>
              </div>

              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={() => setEmailNotifications(!emailNotifications)}
                className="
            h-4
            w-4
            sm:h-5
            sm:w-5
            "
              />
            </div>

            <div
              className="
            flex
            items-center
            justify-between
            gap-3
            "
            >
              <div>
                <p className="text-sm sm:text-base font-semibold">SMS Notifications</p>

                <p className="text-xs sm:text-sm text-gray-500">Receive updates on your phone.</p>
              </div>

              <input
                type="checkbox"
                checked={smsNotifications}
                onChange={() => setSmsNotifications(!smsNotifications)}
                className="
            h-4
            w-4
            sm:h-5
            sm:w-5
            "
              />
            </div>
          </div>
        </div>

        {/* Language */}

        <div
          className="
        border
        rounded-2xl
        sm:rounded-3xl
        p-4
        sm:p-6
        "
        >
          <h2
            className="
          text-lg
          sm:text-2xl
          font-bold
          mb-4
          sm:mb-5
          "
          >
            Language
          </h2>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="
        w-full
        rounded-xl
        border
        p-3
        sm:p-4
        text-sm
        sm:text-base
        outline-none
        "
          >
            <option>English</option>
            <option>Urdu</option>
            <option>Arabic</option>
          </select>
        </div>

        {/* Currency */}

        <div
          className="
        border
        rounded-2xl
        sm:rounded-3xl
        p-4
        sm:p-6
        "
        >
          <h2
            className="
          text-lg
          sm:text-2xl
          font-bold
          mb-4
          sm:mb-5
          "
          >
            Currency
          </h2>

          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="
        w-full
        rounded-xl
        border
        p-3
        sm:p-4
        text-sm
        sm:text-base
        outline-none
        "
          >
            <option>USD</option>
            <option>PKR</option>
            <option>EUR</option>
            <option>GBP</option>
          </select>
        </div>

        {/* Privacy */}

        <div
          className="
        border
        rounded-2xl
        sm:rounded-3xl
        p-4
        sm:p-6
        "
        >
          <h2
            className="
          text-lg
          sm:text-2xl
          font-bold
          mb-4
          sm:mb-5
          "
          >
            Privacy
          </h2>

          <button
            className="
        w-full
        rounded-full
        border
        py-3
        sm:py-4
        text-sm
        sm:text-base
        hover:bg-gray-100
        transition
        "
          >
            Download My Data
          </button>
        </div>

        
      </div>
    </div>
  )
}
