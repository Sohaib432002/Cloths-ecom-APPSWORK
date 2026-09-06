'use client'
import Link from 'next/link'
import StatsSection from './countingdetails'

const profileImages = [
  'https://randomuser.me/api/portraits/men/11.jpg',
  'https://randomuser.me/api/portraits/women/12.jpg',
  'https://randomuser.me/api/portraits/men/23.jpg',
  'https://randomuser.me/api/portraits/women/31.jpg',
  'https://randomuser.me/api/portraits/men/42.jpg',
  'https://randomuser.me/api/portraits/women/48.jpg',
  'https://randomuser.me/api/portraits/men/55.jpg',
  'https://randomuser.me/api/portraits/women/63.jpg',
]
export const AboutUs = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 h-72 w-72 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-10 right-20 h-80 w-80 rounded-full bg-gray-400 blur-3xl"></div>
        </div>

        <div className="relative max-w-310 mx-auto px-5 py-28">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              <span className="inline-block rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-medium backdrop-blur">
                About SHOP.CO
              </span>

              <h1 className="mt-8 text-5xl md:text-7xl font-black leading-tight">
                Fashion That
                <span className="block text-gray-300">Defines You</span>
              </h1>

              <p className="mt-8 text-lg text-gray-300 leading-8 max-w-xl">
                At SHOP.CO, we believe fashion is more than clothing— it's confidence, personality,
                and self-expression. We bring together premium quality, modern trends, and
                affordable prices to help everyone look and feel amazing.
              </p>

              <div className="mt-10 flex flex-wrap gap-5">
                <Link href={'/Store'}>
                  <button className="rounded-full bg-white px-8 py-4 font-semibold text-black hover:bg-gray-200 transition">
                    Shop Collection
                  </button>
                </Link>
              </div>
            </div>

            {/* Right */}
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80"
                alt="Happy Customer"
                className="w-full h-[600px] rounded-3xl object-cover"
              />

              {/* Bottom Left Card */}
              <div className="absolute -bottom-8 -left-8 rounded-3xl bg-white p-6 shadow-2xl">
                <div className="flex items-center gap-4">
                  <img
                    src="https://randomuser.me/api/portraits/women/44.jpg"
                    alt="Customer"
                    className="h-14 w-14 rounded-full object-cover"
                  />

                  <div>
                    <h3 className="text-4xl font-black text-black">50K+</h3>
                    <p className="mt-1 text-gray-600">Happy Customers</p>
                  </div>
                </div>
              </div>

              {/* Top Right Card */}
              <div className="absolute -top-8 -right-8 rounded-3xl bg-black p-6 text-white shadow-2xl">
                <div className="flex items-center gap-4">
                  <img
                    src="https://randomuser.me/api/portraits/men/32.jpg"
                    alt="Brand Partner"
                    className="h-14 w-14 rounded-full border-2 border-white object-cover"
                  />

                  <div>
                    <h3 className="text-4xl font-black">100+</h3>
                    <p className="mt-1 text-gray-300">Premium Brands</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-24">
        <div className="max-w-310 mx-auto px-5">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=80"
                alt="Our Story"
                className="h-[550px] w-full rounded-[35px] object-cover shadow-xl"
              />
            </div>

            <div>
              <span className="uppercase tracking-[4px] text-gray-500 font-semibold">
                Our Story
              </span>

              <h2 className="mt-5 text-5xl font-black">Started With A Simple Mission</h2>

              <p className="mt-8 text-gray-600 leading-8">
                SHOP.CO began with one vision: making premium fashion accessible to everyone. What
                started as a small online store has grown into a trusted destination for thousands
                of fashion lovers worldwide.
              </p>

              <p className="mt-6 text-gray-600 leading-8">
                Every collection is carefully selected to combine exceptional quality, timeless
                style, and affordability. We partner with trusted brands and designers to ensure
                every customer enjoys a premium shopping experience.
              </p>

              <div className="grid grid-cols-2 gap-8 mt-10">
                <div>
                  <h3 className="text-4xl font-black">10+</h3>
                  <p className="text-gray-500 mt-2">Years Experience</p>
                </div>

                <div>
                  <h3 className="text-4xl font-black">150K+</h3>
                  <p className="text-gray-500 mt-2">Orders Delivered</p>
                </div>

                <div>
                  <h3 className="text-4xl font-black">30+</h3>
                  <p className="text-gray-500 mt-2">Countries Served</p>
                </div>

                <div>
                  <h3 className="text-4xl font-black">98%</h3>
                  <p className="text-gray-500 mt-2">Customer Satisfaction</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Intro */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-5 text-center">
          <span className="uppercase tracking-[4px] text-gray-500 font-semibold">Our Journey</span>

          <h2 className="mt-5 text-5xl font-black">
            Growing Together With
            <br />
            Our Customers
          </h2>

          <p className="mt-8 text-gray-600 leading-8">
            Every milestone we've achieved has been possible because of the trust and support of our
            customers. We continue to innovate, improve, and deliver exceptional shopping
            experiences every single day.
          </p>
        </div>
      </section>
      {/* Mission & Vision */}
      <section className="py-24">
        <div className="max-w-310 mx-auto px-5">
          <div className="grid lg:grid-cols-2 gap-10">
            {/* Mission */}
            <div className="rounded-[35px] bg-black text-white p-10  transition duration-300 hover:shadow-xl">
              <h2 className="mt-8 text-4xl font-black">Our Mission</h2>

              <p className="mt-6 text-gray-300 leading-8">
                Our mission is to make premium fashion accessible to everyone. We carefully curate
                stylish collections that combine comfort, quality and affordability while delivering
                an exceptional shopping experience for customers around the world.
              </p>

              <ul className="space-y-4 mt-8 text-gray-200">
                <li className="flex gap-3">
                  <span>✔</span>
                  <span>Premium quality products</span>
                </li>

                <li className="flex gap-3">
                  <span>✔</span>
                  <span>Affordable pricing</span>
                </li>

                <li className="flex gap-3">
                  <span>✔</span>
                  <span>Outstanding customer support</span>
                </li>

                <li className="flex gap-3">
                  <span>✔</span>
                  <span>Fast worldwide delivery</span>
                </li>
              </ul>
            </div>

            {/* Vision */}
            <div className="rounded-[35px] border border-gray-200 p-10 hover:shadow-2xl transition duration-300">
              <h2 className="mt-8 text-4xl font-black">Our Vision</h2>

              <p className="mt-6 text-gray-600 leading-8">
                We envision becoming one of the world's most trusted online fashion destinations by
                inspiring confidence through innovative designs, sustainable practices and
                customer-first service.
              </p>

              <ul className="space-y-4 mt-8 text-gray-700">
                <li className="flex gap-3">
                  <span>✔</span>
                  <span>Global fashion community</span>
                </li>

                <li className="flex gap-3">
                  <span>✔</span>
                  <span>Innovation & creativity</span>
                </li>

                <li className="flex gap-3">
                  <span>✔</span>
                  <span>Eco-friendly future</span>
                </li>

                <li className="flex gap-3">
                  <span>✔</span>
                  <span>Long-lasting customer trust</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-310 mx-auto px-5">
          <div className="text-center max-w-3xl mx-auto">
            <span className="uppercase tracking-[4px] text-gray-500 font-semibold">Our Values</span>

            <h2 className="mt-5 text-5xl font-black">
              The Principles That
              <br />
              Guide Everything We Do
            </h2>

            <p className="mt-6 text-gray-600 leading-8">
              These core values shape every decision we make and every product we deliver to our
              customers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8 mt-16">
            {/* Value 1 */}
            <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl transition">
              <div className="text-5xl">🤝</div>

              <h3 className="text-2xl font-bold mt-6">Integrity</h3>

              <p className="text-gray-600 mt-4 leading-7">
                We believe in honesty, transparency and earning customer trust through every
                interaction.
              </p>
            </div>

            {/* Value 2 */}
            <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl transition">
              <div className="text-5xl">💎</div>

              <h3 className="text-2xl font-bold mt-6">Quality</h3>

              <p className="text-gray-600 mt-4 leading-7">
                Every product is carefully selected and inspected before reaching your wardrobe.
              </p>
            </div>

            {/* Value 3 */}
            <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl transition">
              <div className="text-5xl">❤️</div>

              <h3 className="text-2xl font-bold mt-6">Customer First</h3>

              <p className="text-gray-600 mt-4 leading-7">
                Your satisfaction is our priority from browsing to delivery and beyond.
              </p>
            </div>

            {/* Value 4 */}
            <div className="bg-white rounded-3xl p-8 shadow-md hover:shadow-2xl transition">
              <div className="text-5xl">🌱</div>

              <h3 className="text-2xl font-bold mt-6">Sustainability</h3>

              <p className="text-gray-600 mt-4 leading-7">
                We continuously work towards reducing our environmental impact through responsible
                sourcing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24">
        <div className="max-w-310 mx-auto px-5">
          <div className="text-center">
            <span className="uppercase tracking-[4px] text-gray-500 font-semibold">
              Why Choose Us
            </span>

            <h2 className="mt-5 text-5xl font-black">
              More Than Just
              <br />
              An Online Store
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            <div className="rounded-3xl border p-8 text-center hover:bg-black hover:text-white transition duration-300">
              <div className="text-5xl">🚚</div>

              <h3 className="text-2xl font-bold mt-6">Fast Delivery</h3>

              <p className="mt-4 text-gray-500 hover:text-gray-300">
                Worldwide shipping with quick and secure delivery.
              </p>
            </div>

            <div className="rounded-3xl border p-8 text-center hover:bg-black hover:text-white transition duration-300">
              <div className="text-5xl">🛡️</div>

              <h3 className="text-2xl font-bold mt-6">Secure Payments</h3>

              <p className="mt-4 text-gray-500 hover:text-gray-300">
                Protected transactions using trusted payment gateways.
              </p>
            </div>

            <div className="rounded-3xl border p-8 text-center hover:bg-black hover:text-white transition duration-300">
              <div className="text-5xl">🔄</div>

              <h3 className="text-2xl font-bold mt-6">Easy Returns</h3>

              <p className="mt-4 text-gray-500 hover:text-gray-300">
                Hassle-free returns with a customer-friendly return policy.
              </p>
            </div>

            <div className="rounded-3xl border p-8 text-center hover:bg-black hover:text-white transition duration-300">
              <div className="text-5xl">🎧</div>

              <h3 className="text-2xl font-bold mt-6">24/7 Support</h3>

              <p className="mt-4 text-gray-500 hover:text-gray-300">
                Dedicated support team ready to help whenever you need us.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* ================= OUR STORY ================= */}
      <section className="py-20 bg-black text-white">
        <div className="max-w-310 mx-auto px-5 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <span className="uppercase tracking-[4px] text-gray-400 text-sm">Our Story</span>

            <h2 className="text-4xl md:text-5xl font-black leading-tight mt-4">
              Fashion Is More Than Clothing.
            </h2>

            <p className="text-gray-300 mt-6 leading-8">
              Shop.co started with one simple mission — to create fashion that empowers people.
              Every collection is carefully designed with comfort, confidence and individuality in
              mind.
            </p>

            <p className="text-gray-300 mt-5 leading-8">
              From timeless essentials to trending styles, we help thousands of customers discover
              outfits that perfectly match their personality.
            </p>

            <div className="grid grid-cols-2 gap-8 mt-10">
              <div>
                <h3 className="text-5xl font-black">250K+</h3>

                <p className="text-gray-400 mt-2">Happy Customers Worldwide</p>
              </div>

              <div>
                <h3 className="text-5xl font-black">500+</h3>

                <p className="text-gray-400 mt-2">Premium Fashion Products</p>
              </div>

              <div>
                <h3 className="text-5xl font-black">50+</h3>

                <p className="text-gray-400 mt-2">International Brands</p>
              </div>

              <div>
                <h3 className="text-5xl font-black">24/7</h3>

                <p className="text-gray-400 mt-2">Customer Support</p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80"
              alt="Our Story"
              className="h-[650px] w-full rounded-[40px] object-cover"
            />

            <div className="absolute bottom-8 left-8 bg-white text-black rounded-3xl p-6 shadow-2xl">
              <h3 className="text-4xl font-black">Since 2020</h3>

              <p className="text-gray-600 mt-2">Delivering Premium Fashion Worldwide.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-24">
        <div className="max-w-310 mx-auto px-5">
          <div className="rounded-[40px] bg-gradient-to-r from-black via-gray-900 to-black text-white p-12 md:p-20 text-center">
            <span className="uppercase tracking-[4px] text-gray-400">Join Our Community</span>

            <h2 className="text-4xl md:text-6xl font-black mt-5 leading-tight">
              Discover Fashion
              <br />
              That Defines You.
            </h2>

            <p className="text-gray-300 max-w-2xl mx-auto mt-6 leading-8">
              Explore our latest collections and experience premium quality, exceptional
              craftsmanship and modern style designed for everyone.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-5 mt-10">
              <Link href={'/Store'}>
                <button className="bg-white text-black px-10 py-4 rounded-full font-bold hover:scale-105 transition">
                  Shop Collection
                </button>
              </Link>
              <Link href={'/contact'}>
                <button className="border border-white px-10 py-4 rounded-full hover:bg-white hover:text-black transition">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* ================= TESTIMONIALS ================= */}

      {/* ================= BRANDS ================= */}

      {/* ================= FAQ ================= */}

      {/* ================= FINAL CTA ================= */}

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-310 mx-auto px-5">
          <div className="text-center">
            <span className="uppercase tracking-[4px] text-gray-500">Testimonials</span>

            <h2 className="text-4xl md:text-5xl font-black mt-4">
              Loved By Thousands Of Customers
            </h2>

            <p className="text-gray-500 mt-5 max-w-2xl mx-auto">
              Customer satisfaction is our biggest achievement. Here's what people say about their
              experience with Shop.co.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Fashion Blogger',
                review:
                  'The quality exceeded my expectations. Every product feels premium and delivery was incredibly fast.',
              },
              {
                name: 'Ali Ahmed',
                role: 'Verified Customer',
                review:
                  "I've ordered multiple times and every experience has been amazing. Great customer service and excellent quality.",
              },
              {
                name: 'Emily Watson',
                role: 'Designer',
                review:
                  'Beautiful collections, affordable prices and a premium shopping experience. Highly recommended.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-[30px] p-8 shadow-lg hover:-translate-y-2 transition duration-300"
              >
                <div className="flex text-yellow-400 text-xl">★★★★★</div>

                <p className="text-gray-600 leading-8 mt-5">"{item.review}"</p>

                <div className="mt-8">
                  <h3 className="font-bold text-xl">{item.name}</h3>

                  <p className="text-gray-500">{item.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= BRANDS ================= */}

      {/* ================= FAQ ================= */}
      <section className="py-24 bg-white">
        <div className="max-w-310 mx-auto px-5">
          <div className="text-center">
            <span className="uppercase tracking-[4px] text-gray-500">FAQ</span>

            <h2 className="text-4xl font-black mt-4">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-6 mt-16">
            {[
              {
                q: 'How long does shipping take?',
                a: 'Most orders are delivered within 3–7 business days depending on your location.',
              },
              {
                q: 'Can I return my order?',
                a: 'Yes. You can return products within 30 days of receiving your order.',
              },
              {
                q: 'Do you offer international shipping?',
                a: 'Absolutely! We deliver to customers across multiple countries worldwide.',
              },
              {
                q: 'How can I contact support?',
                a: 'Our support team is available 24/7 through email, phone and live chat.',
              },
            ].map((item, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-sm">
                <h3 className="font-bold text-xl">{item.q}</h3>

                <p className="text-gray-600 mt-3 leading-7">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= WHY CHOOSE US ================= */}
      <section className="py-24 bg-gray-100">
        <div className="max-w-310 mx-auto px-5">
          <div className="text-center">
            <span className="uppercase tracking-[4px] text-gray-500">Why Shop.co</span>

            <h2 className="text-4xl md:text-5xl font-black mt-4">Why Customers Trust Us</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
            {[
              {
                icon: '🚚',
                title: 'Fast Delivery',
                desc: 'Quick and secure shipping worldwide.',
              },
              {
                icon: '💳',
                title: 'Secure Payments',
                desc: '100% protected and encrypted checkout.',
              },
              {
                icon: '🔄',
                title: 'Easy Returns',
                desc: '30-day hassle-free return policy.',
              },
              {
                icon: '⭐',
                title: 'Premium Quality',
                desc: 'Only the best materials and craftsmanship.',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center bg-white rounded-[30px] shadow-lg p-10 hover:-translate-y-2 transition"
              >
                <div className="text-6xl">{item.icon}</div>

                <h3 className="text-2xl font-bold mt-6">{item.title}</h3>

                <p className="text-gray-500 mt-4 leading-7">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* ================= COMPANY CULTURE ================= */}
      <section className="py-24 bg-black text-white">
        <div className="max-w-310 mx-auto px-5">
          <div className="text-center">
            <span className="uppercase tracking-[4px] text-gray-400">Our Culture</span>

            <h2 className="text-4xl md:text-5xl font-black mt-4">
              A Workplace Built On
              <br />
              Creativity & Innovation
            </h2>

            <p className="text-gray-300 max-w-3xl mx-auto mt-6 leading-8">
              We believe great ideas come from passionate people. Our team collaborates every day to
              build products that inspire confidence, style, and happiness for customers around the
              world.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-14 items-center mt-20">
            <div>
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80"
                alt="Creative Team"
                className="h-[600px] w-full rounded-[35px] object-cover"
              />
            </div>

            <div className="space-y-8">
              {[
                {
                  title: 'Innovation First',
                  desc: 'We continuously improve our products and customer experience through creativity and modern technology.',
                },
                {
                  title: 'Customer Obsession',
                  desc: 'Every decision we make begins with understanding what creates the best experience for our customers.',
                },
                {
                  title: 'Team Collaboration',
                  desc: 'Our designers, developers and marketers work together to build one exceptional brand.',
                },
                {
                  title: 'Continuous Learning',
                  desc: 'We encourage every team member to learn, grow and innovate every single day.',
                },
              ].map((item, index) => (
                <div key={index} className="flex gap-5">
                  <div className="w-14 h-10 rounded-full bg-white text-black flex items-center justify-center font-bold text-xl">
                    ✓
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold">{item.title}</h3>

                    <p className="text-gray-300 mt-1 leading-8">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= OFFICE GALLERY ================= */}
      <section className="py-24">
        <div className="max-w-310 mx-auto px-5">
          <div className="text-center">
            <span className="uppercase tracking-[4px] text-gray-500">Gallery</span>

            <h2 className="text-4xl md:text-5xl font-black mt-4">Inside Shop.co</h2>

            <p className="text-gray-500 mt-5 max-w-2xl mx-auto">
              Take a quick look inside our offices, creative spaces, and the people who make
              everything possible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
            {[
              'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1200&q=80',
              'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=1200&q=80',
              'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&q=80',
              'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&q=80',
              'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&q=80',
              'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1200&q=80',
            ].map((image, index) => (
              <div key={index} className="group overflow-hidden rounded-[30px] shadow-lg">
                <img
                  src={image}
                  alt={`Fashion Collection ${index + 1}`}
                  className="h-[320px] w-full object-cover transition duration-500 "
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= COMPANY NUMBERS ================= */}
      {/* ================= GLOBAL PRESENCE ================= */}
      <section className="py-14 bg-black text-white">
        <div className="max-w-310 mx-auto px-5">
          <div className="text-center">
            <span className="uppercase tracking-[4px] text-gray-400">Global Presence</span>

            <h2 className="text-4xl md:text-5xl font-black mt-4">
              Serving Customers Around The World
            </h2>

            <p className="text-gray-300 max-w-3xl mx-auto mt-6 leading-8">
              From local communities to international markets, Shop.co has become a trusted fashion
              destination delivering premium products across multiple countries.
            </p>
          </div>

          <div className="mt-20">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&q=80"
              alt="Global Presence"
              className="w-full h-[500px] rounded-[35px] object-cover"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[
              {
                number: '35+',
                title: 'Countries',
              },
              {
                number: '500K+',
                title: 'Orders Delivered',
              },
              {
                number: '99%',
                title: 'Customer Satisfaction',
              },
            ].map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur rounded-3xl p-8 text-center">
                <h3 className="text-5xl font-black">{item.number}</h3>

                <p className="text-gray-300 mt-3 text-lg">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CSR ================= */}
      <section className="py-14">
        <div className="max-w-310 mx-auto px-5 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <img
              src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&q=80"
              alt="Corporate Social Responsibility"
              className="h-[600px] w-full rounded-[35px] object-cover"
            />
          </div>

          <div>
            <span className="uppercase tracking-[4px] text-gray-500">Giving Back</span>

            <h2 className="text-5xl font-black mt-4">Making A Positive Impact</h2>

            <p className="text-gray-600 mt-6 leading-8">
              We believe businesses should create value beyond profits. Through education,
              sustainability initiatives, and community support, we're committed to making a
              meaningful difference.
            </p>

            <div className="space-y-6 mt-10">
              {[
                'Supporting Local Communities',
                'Environmental Sustainability',
                'Education & Skill Development',
                'Ethical Manufacturing',
              ].map((item) => (
                <div key={item} className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-black text-white flex items-center justify-center">
                    ✓
                  </div>

                  <span className="font-semibold text-lg">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= CAREERS ================= */}

      {/* =========================
    Final CTA Section
========================= */}
      <section className="bg-black py-24">
        <div className="max-w-310 mx-auto px-5">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Left */}
            <div>
              <span className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm text-white">
                Join Thousands of Happy Customers
              </span>

              <h2 className="mt-6 text-4xl md:text-5xl font-black text-white leading-tight">
                Fashion That Speaks
                <span className="block text-gray-300">Your Personality.</span>
              </h2>

              <p className="mt-6 text-gray-400 leading-8 max-w-xl">
                Whether you're dressing for work, a casual day out, or a special event, SHOP.CO
                offers premium quality fashion that helps you look and feel your best. Join our
                growing community today.
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link href={'/Store'}>
                  <button className="rounded-full bg-white text-black px-8 py-4 font-semibold hover:bg-gray-200 transition">
                    Shop Collection
                  </button>
                </Link>
                <Link href={'/contact'}>
                  <button className="rounded-full border border-white text-white px-8 py-4 hover:bg-white hover:text-black transition">
                    Contact Us
                  </button>
                </Link>
              </div>
            </div>

            {/* Right */}
            <div>
              <StatsSection />
            </div>
          </div>
        </div>
      </section>

      {/* =========================
    Newsletter
========================= */}
      <section className="py-14 bg-white"></section>
    </div>
  )
}
export default AboutUs