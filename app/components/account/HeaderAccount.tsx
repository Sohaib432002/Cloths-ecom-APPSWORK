'use client'

import Link from 'next/link'
import { useSearchParams, usePathname, redirect } from 'next/navigation'

export const HeaderAccount = () => {
  const searchparams = useSearchParams()
  const pathname = usePathname()

  const path = pathname.split('/')[2]
  const heading = searchparams.get('Tab')

  return (
    <div className="mx-3 sm:mx-4 lg:mx-5">
      <div className="mx-auto max-w-310">
        <div className="mx-auto my-3 flex flex-wrap items-center gap-1 text-xs text-gray-500 sm:my-4 sm:text-sm lg:my-6 lg:max-w-360 lg:text-base">
          <Link href="/account" className="hover:text-black">
            Accounts
          </Link>

          <span>
            <i className="fa-solid fa-angle-right text-[10px] sm:text-xs"></i>
          </span>

          <span onClick={() => redirect(pathname)} className="cursor-pointer hover:text-black">
            {path ? path.charAt(0).toUpperCase() + path.slice(1) : 'Account'}
          </span>

          {heading && (
            <>
              <span>
                <i className="fa-solid fa-angle-right text-[10px] sm:text-xs"></i>
              </span>

              <span className="truncate">{heading}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
