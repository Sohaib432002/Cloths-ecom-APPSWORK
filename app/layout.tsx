import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

import Footer from './components/common/Footer'
import Navbar from './components/common/Navbar'

import { CartProvider } from '@/context/CartContext'
import { ProductProvider } from '@/context/ProductsContext'
import { WishlistProvider } from '@/context/wishlistContext'
import { OrdersProvider } from '@/context/OrdersContext'

import '@fortawesome/fontawesome-free/css/all.min.css'
import { NotificationProvider } from '@/context/NotificationContext'
import ClearStorage from './components/common/clearStorage'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'SHOP.CO | Premium Fashion & Clothing Store',
  description:
    'Discover the latest trends in men’s, women’s, and kids’ fashion at SHOP.CO. Shop premium clothing, footwear, accessories, and exclusive collections with fast delivery and secure checkout.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body>
        
        <ProductProvider>
          <NotificationProvider>
            <CartProvider>
              <OrdersProvider>
                <WishlistProvider>
                  <Suspense fallback={null}>
                    <Navbar />
                  </Suspense>
                  <div className="mx-4">{children}</div>

                  <Footer />
                </WishlistProvider>
              </OrdersProvider>
            </CartProvider>
          </NotificationProvider>
        </ProductProvider>
      </body>
    </html>
  )
}
