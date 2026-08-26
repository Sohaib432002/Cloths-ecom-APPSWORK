'use client'
import React, { useState } from 'react'

import Link from 'next/link'

import { useRouter } from 'next/navigation'
export const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (email && password) {
      localStorage.setItem(
        'Login Details',
        JSON.stringify({
          email,
          password,
        })
      )
      router.push('/')
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6 mt-10">
        <div>
          <label className="block text-sm font-semibold mb-2">Email Address</label>

          <input
            type="email"
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-full bg-[#F5F5F5] border border-transparent px-6 py-4 outline-none focus:border-black transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Password</label>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-full bg-[#F5F5F5] border border-transparent px-6 py-4 pr-14 outline-none focus:border-black transition"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500"
            >
              <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" />
            Remember me
          </label>

          <Link href="/forgot-password" className="font-semibold hover:underline">
            Forgot Password?
          </Link>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white rounded-full py-4 font-semibold hover:bg-gray-800 transition"
        >
          Sign In
        </button>
      </form>
    </div>
  )
}
