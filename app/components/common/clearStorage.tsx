'use client'

import { useEffect } from 'react'

export default function ClearStorage() {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      localStorage.clear()
      sessionStorage.clear()
    }
  }, [])

  return null
}
