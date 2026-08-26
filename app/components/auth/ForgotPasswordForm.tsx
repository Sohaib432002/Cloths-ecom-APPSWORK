'use client'

import Link from 'next/link'
import { Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  return (
    <section className="min-h-screen bg-[#F2F0F1] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-[0_0_35px_rgba(0,0,0,0.12)] p-8 md:p-10">
        <div className="text-center">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-5">
            <Mail className="text-white w-7 h-7" />
          </div>

          <h1 className="text-3xl font-bold">Forgot Password?</h1>

          <p className="text-gray-500 mt-3 leading-7">
            Don&apos;t worry! Enter your email address below and we&apos;ll send you a link to reset
            your password.
          </p>
        </div>

        <form className="mt-8 space-y-6">
          <div>
            <label className="block mb-2 font-medium">Email Address</label>

            <input
              type="email"
              placeholder="example@email.com"
              className="w-full rounded-full bg-[#F0F0F0] px-5 py-4 outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-4 rounded-full font-semibold hover:bg-gray-800 transition"
          >
            Send Reset Link
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/login" className="text-sm font-medium text-black hover:underline">
            ← Back to Login
          </Link>
        </div>
      </div>
    </section>
  )
}
