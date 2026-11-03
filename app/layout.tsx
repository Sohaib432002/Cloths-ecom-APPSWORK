import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Plus_Jakarta_Sans, Caveat } from 'next/font/google'
import './globals.css'
import Footer from './components/common/Footer'
import Navbar from './components/common/Navbar'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/wishlistContext'
import { OrdersProvider } from '@/context/OrdersContext'
import { NotificationProvider } from '@/context/NotificationContext'
import { AuthProvider } from '@/context/AuthContext'
import { getCurrentUser } from '@/lib/auth/session'
import { StylistLauncher } from './components/stylist/StylistChat'

const jakarta = Plus_Jakarta_Sans({
  variable: '--font-jakarta',
  subsets: ['latin'],
})

const caveat = Caveat({
  variable: '--font-hand',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Véora | Modern Fashion For Every You',
    template: '%s | Véora',
  },
  description:
    'Véora is a modern fashion store for women, men, accessories and footwear. Premium quality, effortless style, secure checkout and an in-house personal stylist.',
  openGraph: {
    title: 'Véora | Modern Fashion For Every You',
    description: 'Premium quality, effortless style, all in one place.',
    type: 'website',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  return (
    <html lang="en" className={`${jakarta.variable} ${caveat.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-black">
        <AuthProvider initialUser={user}>
          <CartProvider>
            <OrdersProvider>
              <NotificationProvider>
                <WishlistProvider>
                  <Suspense fallback={null}>
                    <Navbar />
                  </Suspense>
                  <main id="main-content" className="px-4 lg:px-6">{children}</main>
                  <Footer />
                  <StylistLauncher />
                </WishlistProvider>
              </NotificationProvider>
            </OrdersProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
