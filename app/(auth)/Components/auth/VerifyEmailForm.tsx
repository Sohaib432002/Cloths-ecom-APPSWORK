'use client'
import React, { useState } from 'react'
import Link from 'next/link'

export const VerifyEmailForm = () => {
  const [loading, setLoading] = useState(false)

  const handleResendEmail = async () => {
    setLoading(true)

    // TODO: Call your resend verification email API

    setTimeout(() => {
      setLoading(false)
      alert('Verification email sent successfully!')
    }, 1500)
  }

  return (
    <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
      <div className="lg:hidden mb-10">
        <Link href="/">
          <h1 className="text-4xl font-black">SHOP.CO</h1>
        </Link>
      </div>

      <div className="w-24 h-24 rounded-full bg-[#F2F0F1] flex items-center justify-center mb-8">
        <i className="fa-solid fa-envelope-circle-check text-5xl text-black"></i>
      </div>

      <h2 className="text-4xl font-black">Check Your Email</h2>

      <p className="text-gray-500 mt-4 leading-8">
        We&apos;ve sent a verification link to your email address.
        <br />
        Click the link in your inbox to verify your account.
      </p>

      <div className="mt-8 rounded-2xl bg-[#F8F8F8] border p-5">
        <div className="flex items-start gap-4">
          <div className="text-2xl">
            <i className="fa-solid fa-circle-info"></i>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Didn&apos;t receive the email?</h3>

            <ul className="text-sm text-gray-600 space-y-1 list-disc ml-5">
              <li>Check your Spam or Junk folder.</li>
              <li>Make sure you entered the correct email address.</li>
              <li>Wait a few minutes before requesting another email.</li>
            </ul>
          </div>
        </div>
      </div>

      <button
        onClick={handleResendEmail}
        disabled={loading}
        className="mt-8 w-full bg-black text-white rounded-full py-4 font-semibold hover:bg-gray-800 transition disabled:opacity-60"
      >
        {loading ? 'Sending...' : 'Resend Verification Email'}
      </button>

      <Link href="/login" className="mt-6 text-center font-semibold hover:underline">
        Back to Login
      </Link>
    </div>
  )
}
