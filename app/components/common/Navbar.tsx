'use client'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import { useCart } from '@/hooks/usecart'
import { useSearchParams, useRouter } from 'next/navigation'
import { products } from '../../lib/data/products'
import Image from 'next/image'
import { useWishlist } from '@/context/wishlistContext'
import { useNotification } from '@/context/NotificationContext'
type Product = {
  id: number
  title: string
  slug: string
  category: string
  type: string
  brand: string
  price: number
  oldPrice: number | null
  discount: number
  currency: string
  rating: number
  reviews: number
  stock: number
  sku: string
  image: string
  gallery: string[]
  colors: string[]
  sizes: string[]
  style: string
  description: string
  features: string[]
  isNew: boolean
  isFeatured: boolean
}

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
  const [showoffer, setshowoffer] = useState(false)
  const [showNotifcationsbtn, setshowNotifcationsbtn] = useState(false)

  const { isOpen, unreadCount, toggleNotifications, closeNotifications } = useNotification()
  const Styles = [...new Set(products.map((item) => item.style))]
  const { cart } = useCart()
  const searchParams = useSearchParams()
  const sale = searchParams.get('sale')
  const arrival = searchParams.get('arrival')
  const category = searchParams.get('category')
  const minPrice = Number(searchParams.get('minPrice') ?? 0)
  const maxPrice = Number(searchParams.get('maxPrice') ?? 1000)
  const type = searchParams.get('type')
  const size = searchParams.get('size')
  const color = searchParams.get('color')
  const [suggestions, setsuggestions] = useState<Product[]>([])
  const router = useRouter()
  const [loginDetails, setLoginDetails] = useState('')
  const { wishlist } = useWishlist()
  const handleSale = () => {
    const params = new URLSearchParams(searchParams.toString())
    setMenuOpen(false)
    if (sale) {
      params.delete('sale')
    } else {
      params.set('sale', 'true')
      params.delete('arrival')
    }
    router.push(`/Store?${params.toString()}`)
  }
  const [search, setSearch] = useState('')
  const handleClearFilters = () => {
    router.push('/Store')
    setMenuOpen(false)
  }
  const handleSearchProduct = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase()

    setSearch(value)

    if (!value) {
      setsuggestions([])
      return
    }

    const keywords = value.split(/\s+/).filter(Boolean)

    const results = products.filter((product) => {
      const searchable = [
        product.title,
        product.brand,
        product.category,
        product.type,
        product.style,
        ...(product.colors || []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return keywords.every((word) => searchable.includes(word))
    })

    setsuggestions(results)
  }

  const handleLogiSystem = () => {
    if (loginDetails) {
      const data = JSON.parse(loginDetails)

      return router.push('/account/profile?Tab=Dashboard')
    } else router.push('login')
  }
  const handleSignOut = () => {
    localStorage.removeItem('Login Details')
    router.push('/')
  }
  useEffect(() => {
    const data = localStorage.getItem('Login Details')

    const isLoggedIn = !!data

    setshowNotifcationsbtn(isLoggedIn)
    setLoginDetails(data || '')
  }, [handleLogiSystem, handleSignOut])
  const handleArrival = () => {
    const params = new URLSearchParams(searchParams.toString())
    setMenuOpen(false)
    if (arrival) {
      params.delete('arrival')
    } else {
      params.set('arrival', 'true')
      params.delete('sale')
    }
    router.push(`/Store?${params.toString()}`)
  }
  return (
    <>
      <div className="">
        {!loginDetails && (
          <div
            className={`
      overflow-hidden
      transition-all
      
      duration-500
      ease-in-out
      ${showoffer ? 'max-h-0 opacity-0 py-0' : 'max-h-20 opacity-100'}
    `}
          >
            <div
              className="
    relative
    flex
    items-center
    justify-center
    bg-black
    px-10
    py-3
    text-center
    text-xs
    text-white
    sm:px-12
    sm:py-3.5
    sm:text-sm
    lg:text-base
  "
            >
              <p className="max-w-3xl leading-relaxed">
                <span className="font-medium">Sign up today and get</span>
                <span className="mx-1 font-bold text-white">20% OFF</span>
                on your first order.
                <Link
                  href="/signup"
                  className="
        ml-2
        inline-flex
        items-center
        font-semibold
        underline
        underline-offset-4
        transition-all
        duration-200
        hover:text-gray-300
      "
                >
                  Sign Up Now
                </Link>
              </p>

              <button
                onClick={() => setshowoffer(true)}
                aria-label="Close banner"
                className="
      absolute
      right-3
      top-1/2
      flex
      h-8
      w-8
      -translate-y-1/2
      items-center
      justify-center
      rounded-full
      transition-all
      duration-200
      hover:bg-white/15
      hover:rotate-90
      sm:right-5
    "
              >
                <i className="fa-solid fa-xmark text-sm sm:text-base" />
              </button>
            </div>
          </div>
        )}

        <nav className="bg-white px-4  sticky top-0 left-0 right-0 z-30  text-black">
          <div className="max-w-310 border-b-2  py-3 mx-auto h-16 flex items-center justify-between ">
            {/* Mobile Menu Button */}
            <div className="flex gap-5">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="
    xl:hidden
    text-2xl
    transition
  "
              >
                <i
                  className={`
      fa-solid
      ${menuOpen ? 'fa-xmark' : 'fa-bars'}
    `}
                />
              </button>

              {/* Logo */}

              <Link href="/">
                <h1
                  className="
      text-2xl
      sm:text-3xl
      font-black
      tracking-tight
      whitespace-nowrap
    "
                >
                  SHOP.CO
                </h1>
              </Link>
            </div>

            {/* Desktop Navigation */}

            <ul
              className="
    hidden
    xl:flex
    items-center
    gap-5
    2xl:gap-7
    ml-4
    2xl:ml-8
    text-black
    font-medium
  "
            >
              {/* Shop Dropdown */}

              <li>
                <Menu>
                  <MenuButton
                    className="
          inline-flex
          items-center
          gap-1
          rounded-lg
          bg-white
          py-2
          text-gray-700
          outline-none
          transition
          hover:text-black
        "
                  >
                    Shop
                    <ChevronDownIcon
                      className="
            size-5
            text-black
          "
                    />
                  </MenuButton>

                  <MenuItems
                    transition
                    anchor="bottom start"
                    className="
          z-50
          mt-2
          w-52
          rounded-xl
          bg-gray-100
          p-2
          shadow-xl
          ring-1
          ring-black/5
          transition
          duration-200
          ease-out
          data-closed:scale-95
          data-closed:opacity-0
        "
                  >
                    {[
                      {
                        title: "Men's Shop",
                        category: 'Mens',
                      },
                      {
                        title: 'Accessories',
                        category: 'Accessories',
                      },
                      {
                        title: "Children's Shop",
                        category: 'Children',
                      },
                      {
                        title: "Women's Shop",
                        category: 'Womens',
                      },
                    ].map((item) => (
                      <MenuItem key={item.category}>
                        <Link
                          href={{
                            pathname: '/Store',
                            query: {
                              category: item.category,
                            },
                          }}
                          className="
                block
                rounded-lg
                px-3
                py-2
                transition
                hover:bg-white
              "
                        >
                          {item.title}
                        </Link>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </li>

              {/* Sale */}

              <li
                onClick={handleSale}
                className={`cursor-pointer rounded-lg px-3 py-2 transition ${
                  sale ? 'bg-black text-white' : 'hover:bg-gray-100 hover:text-black'
                }`}
              >
                On Sale
              </li>

              {/* New Arrivals */}

              <li
                onClick={handleArrival}
                className={`cursor-pointer rounded-lg px-3 py-2 transition ${
                  arrival ? 'bg-black text-white' : 'hover:bg-gray-100 hover:text-black'
                }`}
              >
                New Arrivals
              </li>

              {/* Dressing Style */}

              {/* <li>
                <Menu>
                  <MenuButton
                    className="
          inline-flex
          items-center
          gap-1
          rounded-lg
          bg-white
          py-2
          text-gray-700
          outline-none
          transition
          hover:text-black
        "
                  >
                    Dressing Style
                    <ChevronDownIcon
                      className="
            size-5
            text-black
          "
                    />
                  </MenuButton>

                  <MenuItems
                    transition
                    anchor="bottom start"
                    className="
          z-50
          mt-2
          w-52
          rounded-xl
          bg-gray-100
          p-2
          shadow-xl
          ring-1
          ring-black/5
          transition
          duration-200
          ease-out
          data-closed:scale-95
          data-closed:opacity-0
        "
                  >
                    {Styles.map((item) => (
                      <MenuItem key={item}>
                        <Link
                          href={{
                            pathname: '/Store',

                            query: {
                              style: item,
                              sale,
                              arrival,
                              category,
                              minPrice,
                              maxPrice,
                              type,
                              color,
                              size,
                            },
                          }}
                          className="
                block
                rounded-lg
                px-3
                py-2
                transition
                hover:bg-white
              "
                        >
                          {item}
                        </Link>
                      </MenuItem>
                    ))}
                  </MenuItems>
                </Menu>
              </li> */}
            </ul>
            {/* Search */}

            <div
              className="
    hidden
    md:flex
    relative
    items-center
    bg-[#F0F0F0]
    rounded-full
    px-4
    lg:px-5
    py-2
    w-72
    lg:w-96
  "
            >
              <i className="fa-solid fa-magnifying-glass text-gray-500" />

              <input
                type="text"
                value={search}
                onChange={handleSearchProduct}
                placeholder="Search for products..."
                className="
      ml-3
      w-full
      bg-transparent
      outline-none
      text-sm
      lg:text-base
    "
              />

              {/* Search Suggestions */}

              {search.length > 0 && (
                <div
                  className="
          absolute
          left-0
          right-0
          top-full
          mt-3
          z-[999]
          overflow-hidden
          rounded-3xl
          border
          border-gray-200
          bg-white
          shadow-2xl
        "
                >
                  {suggestions.length > 0 ? (
                    <>
                      <div
                        className="
                  max-h-[420px]
                  overflow-y-auto
                  py-2
                "
                      >
                        {suggestions.slice(0, 8).map((item) => (
                          <Link
                            key={item.id}
                            href={`/ProductDetails/${item.slug}`}
                            onClick={() => setSearch('')}
                            className="
                        group
                        flex
                        items-center
                        gap-3
                        px-4
                        py-3
                        transition
                        hover:bg-gray-50
                      "
                          >
                            <div
                              className="
                          relative
                          h-12
                          w-12
                          lg:h-16
                          lg:w-16
                          shrink-0
                          overflow-hidden
                          rounded-xl
                          bg-gray-100
                        "
                            >
                              <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="
                            object-cover
                            transition
                            duration-300
                            group-hover:scale-105
                          "
                              />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3
                                className="
                            truncate
                            text-sm
                            lg:text-base
                            font-semibold
                            text-gray-900
                          "
                              >
                                {item.title}
                              </h3>

                              <p
                                className="
                            text-xs
                            lg:text-sm
                            text-gray-500
                          "
                              >
                                {item.category}
                              </p>
                            </div>

                            <div className="text-right">
                              <p
                                className="
                            text-sm
                            lg:text-lg
                            font-bold
                          "
                              >
                                ${item.price}
                              </p>

                              {item.oldPrice && (
                                <p
                                  className="
                                text-xs
                                lg:text-sm
                                text-gray-400
                                line-through
                              "
                                >
                                  ${item.oldPrice}
                                </p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>

                      <div
                        className="
                  border-t
                  bg-gray-50
                  p-3
                  lg:p-4
                "
                      >
                        <Link
                          href={`/Store?search=${encodeURIComponent(search)}`}
                          onClick={() => setSearch('')}
                          className="
                    flex
                    items-center
                    justify-center
                    rounded-xl
                    bg-black
                    py-2.5
                    lg:py-3
                    text-sm
                    lg:text-base
                    font-semibold
                    text-white
                    transition
                    hover:bg-gray-800
                  "
                        >
                          See all {suggestions.length} results
                          <i
                            className="
                    fa-solid
                    fa-arrow-right
                    ml-2
                  "
                          />
                        </Link>
                      </div>
                    </>
                  ) : (
                    <div
                      className="
                flex
                flex-col
                items-center
                justify-center
                py-10
              "
                    >
                      <div
                        className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  bg-gray-100
                "
                      >
                        <i
                          className="
                  fa-solid
                  fa-magnifying-glass
                  text-xl
                  text-gray-400
                "
                        />
                      </div>

                      <h3
                        className="
                mt-3
                font-semibold
              "
                      >
                        No products found
                      </h3>

                      <p
                        className="
                text-sm
                text-gray-500
              "
                      >
                        Try searching another keyword.
                      </p>

                      <Link
                        href="/Store"
                        onClick={() => setSearch('')}
                        className="
                  mt-5
                  rounded-xl
                  bg-black
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                  hover:bg-gray-800
                "
                      >
                        Browse Products
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* notifications */}
            <div className="flex gap-4">
              {showNotifcationsbtn && (
                <div className="relative">
                  <button onClick={toggleNotifications} className="relative cursor-pointer">
                    {unreadCount > 0 && (
                      <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                        {unreadCount}
                      </span>
                    )}

                    <i className="fa-solid fa-bell text-xl" />
                  </button>

                  {isOpen && (
                    <div
                      className="
          absolute
          
          mt-3
          w-80
          rounded-2xl
          border
          border-gray-200
          bg-white
          shadow-2xl
          z-50
          md:right-0
          -right-30
          overflow-hidden
        "
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between border-b px-5 py-4">
                        <h3 className="text-lg font-semibold">Notifications</h3>
                      </div>

                      {/* Notifications */}
                      <div className="max-h-96 overflow-y-auto">
                        <div className="border-b px-5 py-4 hover:bg-gray-50 transition">
                          <p className="font-medium">🎉 Your order has been placed successfully.</p>

                          <p className="mt-1 text-sm text-gray-500">2 minutes ago</p>
                        </div>

                        <div className="border-b px-5 py-4 hover:bg-gray-50 transition">
                          <p className="font-medium">🚚 Your package is out for delivery.</p>

                          <p className="mt-1 text-sm text-gray-500">1 hour ago</p>
                        </div>

                        <div className="border-b px-5 py-4 hover:bg-gray-50 transition">
                          <p className="font-medium">💸 20% discount is available today.</p>

                          <p className="mt-1 text-sm text-gray-500">Yesterday</p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="border-t p-3">
                        <button
                          onClick={(e) => {
                            router.push('/notifications')
                            setshowNotifcationsbtn(false)
                            e.stopPropagation()
                            closeNotifications()
                          }}
                          className="
    w-full
    rounded-xl
    bg-black
    py-3
    text-sm
    font-semibold
    text-white
    transition-all
    duration-300
    hover:-translate-y-0.5
    hover:bg-gray-800
    hover:shadow-lg
    active:scale-95
  "
                        >
                          View All Notifications
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <Link
                href="/wishlist"
                className="
    relative
  "
              >
                {wishlist.length > 0 && (
                  <span
                    className="
absolute
-right-2
-top-2
flex
h-4
min-w-4
items-center
justify-center
rounded-full
bg-red-500
px-1
text-[10px]
text-white
"
                  >
                    {wishlist.length}
                  </span>
                )}

                <i
                  className="
fa-solid
fa-shield-heart
cursor-pointer
text-lg
sm:text-xl
"
                />
              </Link>

              {/* Cart */}

              <Link href="/cart" className="relative">
                {cart.length > 0 && (
                  <span
                    className="
absolute
-right-2
-top-2
flex
h-4
min-w-4
items-center
justify-center
rounded-full
bg-red-500
px-1
text-[10px]
text-white
"
                  >
                    {cart.length}
                  </span>
                )}

                <i
                  className="
fa-solid
fa-cart-shopping
cursor-pointer
text-lg
sm:text-xl
"
                />
              </Link>

              {/* User */}

              {loginDetails ? (
                <Menu>
                  <MenuButton
                    className="
flex
items-center
outline-none
"
                  >
                    <i
                      className="
fa-regular
fa-circle-user
cursor-pointer
text-lg
sm:text-xl
"
                    />
                  </MenuButton>

                  <MenuItems
                    transition
                    anchor="bottom end"
                    className="
z-50
mt-2
w-44
rounded-xl
bg-gray-100
p-2
shadow-xl
transition
data-closed:scale-95
data-closed:opacity-0
"
                  >
                    <MenuItem>
                      <Link
                        href="/account/profile?Tab=Dashboard"
                        className="
block
rounded-lg
px-3
py-2
hover:bg-white
"
                      >
                        Profile
                      </Link>
                    </MenuItem>

                    <MenuItem>
                      <button
                        onClick={handleSignOut}
                        className="
w-full
rounded-lg
px-3
py-2
text-left
hover:bg-white
"
                      >
                        Sign Out
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              ) : (
                <button onClick={handleLogiSystem}>
                  <i
                    className="
fa-regular
fa-circle-user
cursor-pointer
text-lg
sm:text-xl
"
                  />
                </button>
              )}
            </div>
          </div>

          <div
            className={`
    xl:hidden 
    absolute 
    left-0 
    top-full 
    w-full 
    z-[100]
    bg-white
    border-t
    shadow-lg
    transition-all
    duration-500
    ease-in-out
    ${
      menuOpen
        ? 'max-h-[calc(100vh-64px)] opacity-100 overflow-y-auto'
        : 'max-h-0 opacity-0 overflow-hidden'
    }
  `}
          >
            <ul className="flex flex-col">
              {/* Shop Dropdown */}
              <li className="border-b border-gray-200">
                <button
                  onClick={() => setShopOpen(!shopOpen)}
                  className="
          w-full
          flex
          justify-between
          items-center
          px-6
          py-4
          text-left
          font-medium
          hover:bg-gray-100
          transition
        "
                >
                  <span>Shop</span>

                  <i
                    className={`
            fa-solid 
            fa-chevron-down
            transition-transform
            duration-300
            ${shopOpen ? 'rotate-180' : ''}
          `}
                  />
                </button>

                <div
                  className={`
          overflow-hidden
          transition-all
          duration-500
          ease-in-out
          ${shopOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}
        `}
                >
                  <ul className="bg-gray-50 py-2">
                    {[
                      {
                        name: "Men's Clothing",
                        category: 'Mens',
                      },
                      {
                        name: "Women's Clothing",
                        category: 'Womens',
                      },
                      {
                        name: 'Kids Collection',
                        category: 'Children',
                      },
                      {
                        name: 'Accessories',
                        category: 'Accessories',
                      },
                    ].map((item) => (
                      <Link
                        key={item.category}
                        href={{
                          pathname: '/Store',
                          query: {
                            category: item.category,
                          },
                        }}
                        onClick={() => setMenuOpen(false)}
                      >
                        <li
                          className="
                  px-10
                  py-3
                  text-sm
                  cursor-pointer
                  hover:bg-gray-100
                  transition
                "
                        >
                          {item.name}
                        </li>
                      </Link>
                    ))}
                  </ul>
                </div>
              </li>
              {/* Sale */}
              <li
                onClick={handleSale}
                className={`flex cursor-pointer items-center justify-between border-b border-gray-200 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                  sale ? 'bg-black text-white' : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <span>On Sale</span>

                {sale && <i className="fa-solid fa-check text-xs" />}
              </li>
              {/* New Arrival */}
              <li
                onClick={handleArrival}
                className={`flex cursor-pointer items-center justify-between border-b border-gray-200 px-6 py-4 text-sm font-medium transition-all duration-200 ${
                  arrival
                    ? 'bg-black text-white'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                }`}
              >
                <span>New Arrivals</span>

                {arrival && <i className="fa-solid fa-check text-xs" />}
              </li>
              {/* Dressing Style */}
              {/* <li className="border-b border-gray-200 px-6">
                <button
                  onClick={() => setshowDressingStyleOpen(!showDressingStyleOpen)}
                  className="
          flex
          w-full
          justify-between
          items-center
          py-4
          font-medium
        "
                >
                  Dressing Style
                  <i
                    className={`
            fa-solid
            fa-chevron-down
            transition-transform
            duration-300
            ${showDressingStyleOpen ? 'rotate-180' : ''}
          `}
                  />
                </button>

                <div
                  className={`
          overflow-hidden
          transition-all
          duration-500
          ${showDressingStyleOpen ? 'max-h-96' : 'max-h-0'}
        `}
                >
                  <ul className="pb-4 space-y-2">
                    {Styles.map((item, index) => (
                      <li key={`${item}-${index}`}>
                        <Link
                          onClick={() => setMenuOpen(false)}
                          href={{
                            pathname: '/Store',
                            query: {
                              style: item,
                              sale,
                              arrival,
                              category,
                              minPrice,
                              maxPrice,
                              type,
                              color,
                              size,
                            },
                          }}
                          className="
                  block
                  rounded-lg
                  px-3
                  py-2
                  text-sm
                  hover:bg-gray-100
                  transition
                "
                        >
                          {item}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>{' '} */}

              {/* Mobile Search */}
              <li className="p-4">
                <div
                  className="
        flex
        items-center
        rounded-full
        bg-[#F0F0F0]
        px-4
        py-3
      "
                >
                  <i className="fa-solid fa-magnifying-glass text-gray-500" />

                  <input
                    type="text"
                    value={search}
                    onChange={handleSearchProduct}
                    placeholder="Search products..."
                    className="
            ml-3
            w-full
            bg-transparent
            outline-none
            text-sm
          "
                  />
                </div>

                {/* Search Suggestions */}

                {search.length > 0 && (
                  <div
                    className="
            mt-3
            rounded-2xl
            border
            border-gray-200
            bg-white
            shadow-xl
            overflow-hidden
          "
                  >
                    {suggestions.length > 0 ? (
                      <>
                        <div
                          className="
                  max-h-[400px]
                  overflow-y-auto
                "
                        >
                          {suggestions.slice(0, 8).map((item) => (
                            <Link
                              key={item.id}
                              href={`/ProductDetails/${item.slug}`}
                              onClick={() => {
                                setSearch('')
                                setMenuOpen(false)
                              }}
                              className="
                      flex
                      items-center
                      gap-3
                      px-4
                      py-3
                      hover:bg-gray-50
                      transition
                    "
                            >
                              <div
                                className="
                        relative
                        h-14
                        w-14
                        shrink-0
                        overflow-hidden
                        rounded-xl
                        bg-gray-100
                      "
                              >
                                <Image
                                  src={item.image}
                                  alt={item.title}
                                  fill
                                  className="
                          object-cover
                        "
                                />
                              </div>

                              <div
                                className="
                        min-w-0
                        flex-1
                      "
                              >
                                <h3
                                  className="
                          truncate
                          text-sm
                          font-semibold
                        "
                                >
                                  {item.title}
                                </h3>

                                <p
                                  className="
                          text-xs
                          text-gray-500
                          mt-1
                        "
                                >
                                  {item.category}
                                </p>
                              </div>

                              <div
                                className="
                        text-right
                        shrink-0
                      "
                              >
                                <p
                                  className="
                          font-bold
                          text-sm
                        "
                                >
                                  ${item.price}
                                </p>

                                {item.oldPrice && (
                                  <p
                                    className="
                            text-xs
                            text-gray-400
                            line-through
                          "
                                  >
                                    ${item.oldPrice}
                                  </p>
                                )}
                              </div>
                            </Link>
                          ))}
                        </div>

                        <Link
                          href={`/Store?search=${encodeURIComponent(search)}`}
                          onClick={() => {
                            setSearch('')
                            setMenuOpen(false)
                          }}
                          className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  bg-black
                  text-white
                  py-3
                  text-sm
                  font-semibold
                  transition
                  hover:bg-gray-800
                "
                        >
                          See all {suggestions.length} results
                          <i className="fa-solid fa-arrow-right" />
                        </Link>
                      </>
                    ) : (
                      <div
                        className="
                flex
                flex-col
                items-center
                justify-center
                py-10
                px-5
                text-center
              "
                      >
                        <div
                          className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  bg-gray-100
                "
                        >
                          <i
                            className="
                    fa-solid
                    fa-magnifying-glass
                    text-xl
                    text-gray-400
                  "
                          />
                        </div>

                        <h3
                          className="
                  mt-3
                  font-semibold
                "
                        >
                          No products found
                        </h3>

                        <p
                          className="
                  mt-1
                  text-sm
                  text-gray-500
                "
                        >
                          Try another keyword
                        </p>

                        <Link
                          href="/Store"
                          onClick={() => {
                            setSearch('')
                            setMenuOpen(false)
                          }}
                          className="
                  mt-4
                  rounded-xl
                  bg-black
                  px-5
                  py-2.5
                  text-sm
                  font-medium
                  text-white
                "
                        >
                          Browse Products
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </>
  )
}

export default Navbar
