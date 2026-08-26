'use client'

import { CheckCircle, X } from 'lucide-react'
import { useEffect } from 'react'

type Props = {
  message: string
  show: boolean
  onClose: () => void
}

export const Alert = ({ message, show, onClose }: Props) => {
  useEffect(() => {
    if (!show) return

    const timer = setTimeout(() => {
      onClose()
    }, 2500)

    return () => clearTimeout(timer)
  }, [show, onClose])
  
  return (
    <div
      className={`z-200 top-5 absolute right-5 transition-all duration-300 ${
        show ? 'translate-y-0 opacity-100' : '-translate-y-5 opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-3 rounded-xl bg-green-600 px-5 py-4 text-white shadow-xl">
        <CheckCircle size={22} />

        <div>
          <h3 className="font-semibold">Success</h3>
          <p className="text-sm">{message}</p>
        </div>

        <button onClick={onClose}>
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
