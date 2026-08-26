'use client'
import React, { useState } from 'react'

export const ResetPasswordForm = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert('Passwords do not match!')
      return
    }

    console.log({
      password,
      confirmPassword,
    })

    // TODO: Reset Password API
  }
  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-6 mt-10">
        {/* New Password */}
        <div>
          <label className="block text-sm font-semibold mb-2">New Password</label>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="********"
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

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-semibold mb-2">Confirm Password</label>

          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-full bg-[#F5F5F5] border border-transparent px-6 py-4 pr-14 outline-none focus:border-black transition"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500"
            >
              <i className={`fa-solid ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white rounded-full py-4 font-semibold hover:bg-gray-800 transition"
        >
          Reset Password
        </button>
      </form>
    </div>
  )
}
