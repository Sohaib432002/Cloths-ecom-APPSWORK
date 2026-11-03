import { Suspense } from 'react'
import Link from 'next/link'
import { ResetPasswordForm } from '../Components/auth'

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#F4F0FF] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-6xl bg-white rounded-[32px] overflow-hidden shadow-xl grid lg:grid-cols-2">
        {/* Left Side */}
        <div className="hidden lg:flex bg-brand text-white flex-col justify-between p-12">
          <Link href="/">
            <h1 className="text-4xl font-black cursor-pointer">Véora</h1>
          </Link>

          <div>
            <h2 className="text-5xl font-extrabold leading-tight">
              Create a
              <br />
              New Password
            </h2>

            <p className="text-gray-300 mt-6 text-lg leading-8">
              Choose a strong password to keep your account secure.
            </p>
          </div>

          <p className="text-sm text-gray-400">© 2026 Véora. All rights reserved.</p>
        </div>

        {/* Right Side */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
          <div className="lg:hidden mb-10">
            <Link href="/">
              <h1 className="text-4xl font-black">Véora</h1>
            </Link>
          </div>

          <div className="w-20 h-20 rounded-full bg-[#F4F0FF] flex items-center justify-center mb-6">
            <i className="fa-solid fa-key text-3xl text-black"></i>
          </div>

          <h2 className="text-4xl font-black">Reset Password</h2>

          <p className="text-gray-500 mt-3 leading-7">
            Enter your new password below. Make sure it&apos;s strong and easy for you to remember.
          </p>

          <Suspense fallback={<p>Loading reset form...</p>}>
            <ResetPasswordForm />
          </Suspense>

          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-black font-semibold hover:underline"
            >
              <i className="fa-solid fa-arrow-left"></i>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
