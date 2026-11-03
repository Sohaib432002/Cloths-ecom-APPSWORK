import Link from 'next/link'
import { Suspense } from 'react'
import { VerifyEmailForm } from '../Components/auth'

export default function VerifyEmailPage() {
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
              Verify
              <br />
              Your Email
            </h2>

            <p className="text-gray-300 mt-6 text-lg leading-8">
              You&apos;re almost there! Please verify your email address to activate your account
              and start shopping.
            </p>
          </div>

          <p className="text-sm text-gray-400">© 2026 Véora. All rights reserved.</p>
        </div>

        {/* Right Side */}
        <Suspense fallback={<p className="p-8">Loading verification...</p>}>
          <VerifyEmailForm />
        </Suspense>
      </div>
    </div>
  )
}
