import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
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

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'SHOP.CO | Premium Fashion Store',
    template: '%s | SHOP.CO',
  },
  description:
    'Shop premium mens, womens, and kids fashion at SHOP.CO. Discover curated clothing with secure checkout and an AI personal stylist.',
  openGraph: {
    title: 'SHOP.CO | Premium Fashion Store',
    description: 'Curated clothing, secure checkout, and an AI stylist built into the shopping experience.',
    type: 'website',
  },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser()

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-white text-neutral-950">
        <AuthProvider initialUser={user}>
          <CartProvider>
            <OrdersProvider>
              <NotificationProvider>
                <WishlistProvider>
                  <Suspense fallback={null}>
                    <Navbar />
                  </Suspense>
                  <main id="main-content">{children}</main>
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
