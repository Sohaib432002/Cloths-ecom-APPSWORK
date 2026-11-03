import Link from 'next/link'
import { ForgotPasswordForm } from '../Components/auth'

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-310 py-10">
      <div className="mx-auto grid overflow-hidden rounded-3xl bg-white shadow-xl lg:grid-cols-2">
        <div className="hidden flex-col justify-between bg-brand p-12 text-white lg:flex">
          <Link href="/">
            <h1 className="text-4xl font-black">Véora</h1>
          </Link>
          <div>
            <h2 className="text-5xl font-extrabold">Reset access</h2>
            <p className="mt-6 text-lg text-gray-300">
              Enter the email on your account and we will generate a reset link.
            </p>
          </div>
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} Véora</p>
        </div>
        <div className="p-8 sm:p-12">
          <h2 className="text-4xl font-black">Forgot password</h2>
          <p className="mt-3 text-gray-500">We will send you a secure reset link for this demo.</p>
          <div className="mt-8">
            <ForgotPasswordForm />
          </div>
          <p className="mt-8 text-center text-sm">
            <Link href="/login" className="font-semibold hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
