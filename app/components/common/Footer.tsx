'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const Footer = () => {
  const [loginDetails, setLoginDetails] = useState('')
  const router = useRouter()
  useEffect(() => {
    const data = localStorage.getItem('Login Details') || ''
    setLoginDetails(data)
  }, [])
  const handleLogiSystem = () => {
    if (loginDetails) {
      const data = JSON.parse(loginDetails)

      return router.push('/account/profile?Tab=Dashboard')
    } else router.push('login')
  }
  const handleOrdersystem = () => {
    if (loginDetails) {
      const data = JSON.parse(loginDetails)
      return router.push('/account/profile?Tab=Orders')
    } else router.push('login')
  }
  const handlePayementsystem = () => {
    if (loginDetails) {
      const data = JSON.parse(loginDetails)
      return router.push('/account/profile?Tab=Payment+Methods')
    } else router.push('login')
  }
  return (
    <div className="mt-40">
      <section className="  bg-[#F0F0F0]  pb-3">
        <div
          className="
    mx-4
    -mt-20
    rounded-3xl
    bg-black
    px-5
    py-8
    -translate-y-5
    sm:mx-6
    sm:px-8
    sm:py-10
    lg:mx-auto
    lg:max-w-310 
    lg:px-12
    lg:py-12
  "
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            {/* Heading */}
            <div className="max-w-310 m-auto ">
              <h2
                className="
          text-2xl
          font-extrabold
          leading-tight
          text-white
          sm:text-3xl
          md:text-4xl
          lg:text-5xl
        "
              >
                STAY UP TO DATE ABOUT OUR LATEST OFFERS
              </h2>
            </div>

            {/* Newsletter */}
            <div className="w-full max-w-md space-y-4">
              <div
                className="
          flex
          items-center
          rounded-full
          bg-white
          px-4
          py-3
          sm:px-5
          sm:py-4
        "
              >
                <i className="fa-regular fa-envelope text-gray-500 text-base sm:text-lg"></i>

                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="
            ml-3
            w-full
            bg-transparent
            text-sm
            sm:text-base
            outline-none
          "
                />
              </div>

              <button
                className="
          w-full
          rounded-full
          bg-white
          py-3
          text-sm
          font-semibold
          text-black
          transition-all
          duration-300
          hover:bg-gray-200
          active:scale-95
          sm:py-4
          sm:text-base
        "
              >
                Subscribe to Newsletter
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 lg:mt-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand */}
            <div className="sm:col-span-2">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black">SHOP.CO</h2>

              <p
                className="
          mt-4
          max-w-md
          text-xs
          leading-6
          text-gray-500
          sm:text-sm
          sm:leading-7
          lg:text-base
        "
              >
                We have clothes that suit your style and you'll be proud to wear them. From women to
                men, discover premium fashion for every occasion.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {[
                  { icon: '𝕏', label: 'X' },
                  { icon: 'f', label: 'Facebook' },
                  { icon: '◎', label: 'Instagram' },
                  { icon: '◉', label: 'YouTube' },
                ].map((item) => (
                  <a
                    key={item.label}
                    href="#"
                    aria-label={item.label}
                    className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              text-sm
              transition-all
              duration-300
              hover:bg-black
              hover:text-white
              sm:h-10
              sm:w-10
              sm:text-base
            "
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Company */}
            <div>
              <h3
                className="
          mb-4
          text-sm
          font-semibold
          uppercase
          tracking-[2px]
          sm:text-base
        "
              >
                Company
              </h3>

              <ul className="flex flex-col space-y-3 text-sm text-gray-500">
                <Link href="/account/profile?Tab=Dashboard">
                  <li className="cursor-pointer transition hover:text-black">Account</li>
                </Link>

                <Link href="/contact">
                  <li className="cursor-pointer transition hover:text-black">Contact Us</li>
                </Link>

                <Link href="/about">
                  <li className="cursor-pointer transition hover:text-black">About Us</li>
                </Link>
              </ul>
            </div>

            {/* Help */}
            <div>
              <h3
                className="
          mb-4
          text-sm
          font-semibold
          uppercase
          tracking-[2px]
          sm:text-base
        "
              >
                Help
              </h3>

              <ul className="flex flex-col space-y-3 text-sm text-gray-500">
                <Link href="/contact">
                  <li className="cursor-pointer transition hover:text-black">Customer Support</li>
                </Link>

                <Link href="/TermsConditions">
                  <li className="cursor-pointer transition hover:text-black">Terms & Conditions</li>
                </Link>

                <Link href="/PrivacyPolicy">
                  <li className="cursor-pointer transition hover:text-black">Privacy Policy</li>
                </Link>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-10 lg:mt-12">
          <hr className="border-gray-300" />

          <div
            className="
      flex
      flex-col
      items-center
      justify-between
      gap-5
      py-5
      sm:gap-6
      sm:py-6
      lg:flex-row
    "
          >
            {/* Copyright */}
            <p
              className="
        text-center
        text-xs
        text-gray-500
        sm:text-sm
        lg:text-left
      "
            >
              Shop.co © 2000–2023. All Rights Reserved.
            </p>

            {/* Payment Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              {[
                {
                  src: '/images/home/badges/Badge.svg',
                  alt: 'Visa',
                },
                {
                  src: '/images/home/badges/Badge (3).png',
                  alt: 'MasterCard',
                },
                {
                  src: '/images/home/badges/Badge (4).png',
                  alt: 'PayPal',
                },
                {
                  src: '/images/home/badges/Badge (1).png',
                  alt: 'Apple Pay',
                },
              ].map((badge) => (
                <div
                  key={badge.alt}
                  className="
            rounded-lg
            bg-white
            p-1
            shadow-sm
            transition
            hover:shadow-md
            sm:p-2
          "
                >
                  <img
                    src={badge.src}
                    alt={badge.alt}
                    className="
              h-8
              w-auto
              object-contain
              sm:h-10
              lg:h-12
            "
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Footer
