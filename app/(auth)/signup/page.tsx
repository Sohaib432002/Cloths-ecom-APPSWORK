import Link from 'next/link'
import { SignupForm } from '../Components/auth'

export default function SignupPage() {
  return (
    <section className="min-h-screen max-w-310 m-auto   py-8 ">
      <div className="mx-auto grid  overflow-hidden rounded-xl bg-white shadow-xl lg:grid-cols-2 lg:rounded-3xl">
        {/* Left Side */}
        <div className="bg-brand px-6 py-10 text-white sm:px-8 sm:py-12 lg:px-12 lg:py-16">
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
          <h2 className="text-3xl font-bold sm:text-4xl">Sign Up</h2>

          <p className="mt-2 mb-6 text-sm text-gray-500 sm:mb-8 sm:text-base">
            Create your account in a few simple steps.
          </p>

          <SignupForm />

          <div className="my-5 flex items-center gap-3 sm:my-6">
            <div className="flex-1 border"></div>

            <span className="text-xs text-gray-400 sm:text-sm">OR</span>

            <div className="flex-1 border"></div>
          </div>

          <button className="w-full rounded-full border py-3 text-sm font-medium transition hover:bg-lavender-100 sm:py-4 sm:text-base">
            Continue with Google
          </button>

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
