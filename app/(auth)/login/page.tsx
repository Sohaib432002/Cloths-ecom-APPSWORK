import Link from 'next/link'
import { Suspense } from 'react'
import { LoginForm } from '../Components/auth'

export default function LoginPage() {
  return (
    <div className="min-h-screen max-w-310 m-auto    py-6 sm:py-8">
      <div className="mx-auto grid  overflow-hidden rounded-xl bg-white shadow-xl lg:grid-cols-2 lg:rounded-3xl">
        {/* Left Side */}
        <div className="hidden flex-col justify-between bg-black p-8 text-white sm:p-10 lg:flex lg:p-16">
          <Link href="/">
            <h1 className="text-3xl font-black lg:text-5xl">SHOP.CO</h1>
          </Link>

          <div>
            <h2 className="text-3xl font-extrabold leading-tight lg:text-5xl">
              Welcome
              <br />
              Back.
            </h2>

            <p className="mt-4 text-sm leading-6 text-gray-300 lg:mt-6 lg:text-lg lg:leading-8">
              Sign in to continue shopping and discover the latest fashion collections curated just
              for you.
            </p>
          </div>

          <div className="text-xs text-gray-400 lg:text-sm">
            © 2026 SHOP.CO. All rights reserved.
          </div>
        </div>

        {/* Right Side */}
        <div className="px-5 py-8 sm:px-8 sm:py-10 lg:p-16">
          {/* Mobile Logo */}
          <div className="mb-8 lg:hidden">
            <Link href="/">
              <h1 className="text-3xl font-black sm:text-4xl">SHOP.CO</h1>
            </Link>
          </div>

          <h2 className="text-3xl font-black text-black sm:text-4xl">Sign In</h2>

          <p className="mt-2 text-sm text-gray-500 sm:mt-3 sm:text-base">
            Enter your credentials to access your account.
          </p>

          <div className="mt-6 sm:mt-8">
            <Suspense fallback={<p className="text-sm text-gray-500">Loading sign-in form...</p>}>
              <LoginForm />
            </Suspense>
          </div>

          <p className="mt-8 text-center text-sm text-gray-500 sm:mt-10 sm:text-base">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold text-black hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
