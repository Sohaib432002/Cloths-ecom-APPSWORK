import Link from 'next/link'
import { Suspense } from 'react'
import { SignupForm } from '../Components/auth'
import { SocialLogin } from '@/app/components/auth/SocialLogin'

export default function SignupPage() {
  return (
    <section className="min-h-screen max-w-310 m-auto   py-8 ">
      <div className="mx-auto grid  overflow-hidden rounded-xl bg-white shadow-xl lg:grid-cols-2 lg:rounded-3xl">
        {/* Left Side */}
        <div className="hidden bg-brand px-6 py-10 text-white sm:px-8 sm:py-12 lg:block lg:px-12 lg:py-16">
          <h1 className="text-2xl font-extrabold sm:text-3xl lg:text-5xl">Véora</h1>

          <h2 className="mt-6 text-2xl font-bold leading-tight sm:text-3xl lg:text-4xl">
            Create your account and start shopping today.
          </h2>

          <p className="mt-4 text-sm leading-6 text-gray-300 sm:text-base sm:leading-7">
            Discover premium fashion, exclusive deals, and the latest trends with a personalized
            shopping experience.
          </p>
        </div>

        {/* Right Side */}
        <div className="px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <div className="mb-6 lg:hidden">
            <Link href="/" className="text-3xl font-black">
              Véora
            </Link>
          </div>
          <h2 className="text-3xl font-bold sm:text-4xl">Sign Up</h2>

          <p className="mt-2 mb-6 text-sm text-gray-500 sm:mb-8 sm:text-base">
            Create your account in a few simple steps.
          </p>

          <Suspense fallback={null}>
            <SocialLogin />
          </Suspense>
          <SignupForm />

          <p className="mt-6 text-center text-sm text-gray-600 sm:mt-8 sm:text-base">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-black hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
