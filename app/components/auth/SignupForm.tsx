'use client'

import React, { useState } from 'react'

const SignupForm = () => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agree, setAgree] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    console.log({
      fullName,
      email,
      password,
      confirmPassword,
      agree,
    })

    // TODO: Signup API call
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="font-medium block mb-2">Full Name</label>

        <input
          type="text"
          placeholder="John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full rounded-full bg-[#F0F0F0] px-5 py-4 outline-none"
        />
      </div>

      <div>
        <label className="font-medium block mb-2">Email Address</label>

        <input
          type="email"
          placeholder="john@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-full bg-[#F0F0F0] px-5 py-4 outline-none"
        />
      </div>

      <div>
        <label className="font-medium block mb-2">Password</label>

        <input
          type="password"
          placeholder="********"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-full bg-[#F0F0F0] px-5 py-4 outline-none"
        />
      </div>

      <div>
        <label className="font-medium block mb-2">Confirm Password</label>

        <input
          type="password"
          placeholder="********"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded-full bg-[#F0F0F0] px-5 py-4 outline-none"
        />
      </div>

      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mt-1"
        />

        <span className="text-gray-600">I agree to the Terms & Conditions and Privacy Policy.</span>
      </label>

      <button
        type="submit"
        className="w-full bg-black text-white rounded-full py-4 font-semibold hover:bg-gray-800 transition"
      >
        Create Account
      </button>
    </form>
  )
}

export default SignupForm
