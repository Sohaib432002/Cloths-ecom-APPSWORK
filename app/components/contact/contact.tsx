'use client'

import { useState } from 'react'

export const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Unable to send message.')
      alert(data.message)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      })
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Unable to send message.')
    }
  }

  return (
    <div className="bg-lavender-50 overflow-hidden">
      {/* ================= HERO ================= */}

      <section className="bg-brand text-white">
        <div
          className="
          mx-auto 
          max-w-7xl
          px-4
          py-10
          sm:px-6
          sm:py-14
          lg:px-8
          lg:py-20
          "
        >
          <span
            className="
            uppercase
            tracking-[3px]
            sm:tracking-[5px]
            text-gray-400
            text-xs
            sm:text-sm
            "
          >
            Contact Us
          </span>

          <h1
            className="
            mt-5
            text-4xl
            leading-tight
            font-black

            sm:text-5xl

            lg:text-7xl
            "
          >
            We'd Love
            <br />
            To Hear From You
          </h1>

          <p
            className="
            mt-6
            max-w-2xl

            text-sm
            leading-7

            sm:text-base
            sm:leading-8

            lg:text-lg
            "
          >
            Whether you have a question about your order, need product recommendations, or simply
            want to say hello, our team is here to help.
          </p>
        </div>
      </section>

      {/* ================= CONTACT INFO ================= */}

      <section
        className="
        mx-auto
        max-w-7xl
        px-4
        py-8

        sm:px-6
        sm:py-10

        lg:px-8
        "
      >
        <div
          className="
          grid
          grid-cols-1
          gap-5

          md:grid-cols-2

          lg:grid-cols-2
          lg:gap-8
          "
        >
          {/* Visit */}

          <div
            className="
            rounded-3xl
            bg-white
            p-5

            sm:p-8

            shadow-sm
            transition
            hover:shadow-xl
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
              bg-brand
              text-xl
              text-white

              sm:h-16
              sm:w-16
              sm:text-2xl
              "
            >
              📍
            </div>

            <h2
              className="
              mt-6
              text-xl
              font-bold

              sm:text-2xl
              sm:mt-8
              "
            >
              Visit Us
            </h2>

            <p
              className="
              mt-3
              text-sm
              leading-6
              text-gray-500

              sm:mt-4
              sm:text-base
              sm:leading-7
              "
            >
              Online store,
              <br />
              serving customers worldwide
            </p>
          </div>

          {/* Email */}

          <div
            className="
            rounded-3xl
            bg-white
            p-5

            sm:p-8

            shadow-sm
            transition
            hover:shadow-xl
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
              bg-brand
              text-xl
              text-white

              sm:h-16
              sm:w-16
              sm:text-2xl
              "
            >
              ✉️
            </div>

            <h2
              className="
              mt-6
              text-xl
              font-bold

              sm:text-2xl
              sm:mt-8
              "
            >
              Email
            </h2>

            <p className="mt-3 text-sm text-gray-500 sm:mt-4 sm:text-base">sohaibmaqsoodsohaibmaqsood@gmail.com</p>

            <p className="text-sm text-gray-500 sm:text-base">sohaibmaqsoodsohaibmaqsood@gmail.com</p>
          </div>
        </div>
      </section>

      {/* ================= FORM + INFO ================= */}

      <div
        className="
        mx-auto
        max-w-7xl

        px-4
        py-8

        sm:px-6
        sm:py-12

        lg:px-8
        "
      >
        <div
          className="
          grid
          grid-cols-1

          gap-8

          lg:grid-cols-2

          lg:gap-14
          "
        >
          {/* FORM */}

          <div
            className="
            rounded-3xl
            border
            border-gray-100
            bg-white

            p-5

            sm:p-8

            shadow-lg
            "
          >
            <h2
              className="
              text-2xl
              font-bold

              sm:text-3xl
              "
            >
              Send Us a Message
            </h2>

            <p
              className="
              mt-3
              text-sm
              leading-6
              text-gray-500

              sm:text-base
              sm:leading-7
              "
            >
              Have a question about your order, shipping, returns, or anything else? Fill out the
              form below and our support team will respond within 24 hours.
            </p>

            <form className="mt-6 space-y-5 sm:mt-8 sm:space-y-6">
              {' '}
              <div
                className="
                grid
                grid-cols-1
                gap-5

                sm:grid-cols-2
                "
              >
                <div>
                  <label className="mb-2 block text-sm font-semibold">First Name</label>

                  <input
                    type="text"
                    placeholder="John"
                    className="
                    w-full
                    rounded-xl
                    border
                    border-gray-300
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition

                    sm:px-5
                    sm:text-base

                    focus:ring-2
                    focus:ring-brand
                    "
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">Last Name</label>

                  <input
                    type="text"
                    placeholder="Doe"
                    className="
                    w-full
                    rounded-xl
                    border
                    border-gray-300
                    px-4
                    py-3
                    text-sm
                    outline-none

                    sm:px-5
                    sm:text-base

                    focus:ring-2
                    focus:ring-brand
                    "
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Email Address</label>

                <input
                  type="email"
                  placeholder="john@example.com"
                  className="
                  w-full
                  rounded-xl
                  border
                  border-gray-300
                  px-4
                  py-3
                  text-sm
                  outline-none

                  sm:px-5
                  sm:text-base

                  focus:ring-2
                  focus:ring-brand
                  "
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Phone Number</label>

                <input
                  type="text"
                  placeholder="+92 300 1234567"
                  className="
                  w-full
                  rounded-xl
                  border
                  border-gray-300
                  px-4
                  py-3
                  text-sm
                  outline-none

                  sm:px-5
                  sm:text-base

                  focus:ring-2
                  focus:ring-brand
                  "
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Subject</label>

                <input
                  type="text"
                  placeholder="Order Issue"
                  className="
                  w-full
                  rounded-xl
                  border
                  border-gray-300
                  px-4
                  py-3
                  text-sm
                  outline-none

                  sm:px-5
                  sm:text-base

                  focus:ring-2
                  focus:ring-brand
                  "
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold">Message</label>

                <textarea
                  rows={5}
                  placeholder="Write your message..."
                  className="
                  w-full
                  resize-none
                  rounded-xl
                  border
                  border-gray-300
                  px-4
                  py-3
                  text-sm
                  outline-none

                  sm:px-5
                  sm:text-base

                  focus:ring-2
                  focus:ring-brand
                  "
                />
              </div>
              <button
                className="
                w-full
                rounded-xl
                bg-brand
                py-3
                text-sm
                font-semibold
                text-white
                transition

                sm:py-4
                sm:text-base

                hover:bg-brand-dark
                "
              >
                Send Message
              </button>
            </form>
          </div>

          {/* RIGHT CONTACT INFO */}

          <div className="space-y-6 sm:space-y-8">
            <div
              className="
              rounded-3xl
              bg-brand
              p-5
              text-white

              sm:p-8
              "
            >
              <h2
                className="
                text-2xl
                font-bold

                sm:text-3xl
                "
              >
                Contact Information
              </h2>

              <p
                className="
                mt-4
                text-sm
                leading-7
                text-gray-300

                sm:text-base
                "
              >
                Our friendly customer support team is always happy to help. Reach us through any of
                the channels below.
              </p>

              <div className="mt-8 space-y-7 sm:mt-10">
                {[
                  {
                    icon: '📍',
                    title: 'Office Address',
                    text: (
                      <>
                        Online store,
                        <br />
                        serving customers worldwide
                      </>
                    ),
                  },

                  {
                    icon: '✉️',
                    title: 'Email Address',
                    text: 'sohaibmaqsoodsohaibmaqsood@gmail.com',
                  },

                  {
                    icon: '🕒',
                    title: 'Working Hours',
                    text: (
                      <>
                        Monday - Friday
                        <br />
                        9:00 AM - 6:00 PM
                      </>
                    ),
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="
                    flex
                    gap-4
                    "
                  >
                    <div
                      className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      bg-white/10
                      text-xl
                      "
                    >
                      {item.icon}
                    </div>

                    <div>
                      <h3 className="font-semibold">{item.title}</h3>

                      <p className="mt-2 text-sm text-gray-300 sm:text-base">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MAP */}

            <div
              className="
              h-64
              overflow-hidden
              rounded-3xl
              shadow-lg

              sm:h-80
              "
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=YOUR_EMBED_LINK"
                width="100%"
                height="100%"
                loading="lazy"
                className="border-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* FAQ SECTION */}

      <section className="bg-lavender-50 py-12 sm:py-20">
        <div
          className="
          mx-auto
          max-w-7xl
          px-4

          sm:px-6

          lg:px-8
          "
        >
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[3px] text-gray-500 sm:text-sm">
              Support
            </p>

            <h2
              className="
              mt-3
              text-3xl
              font-black

              sm:text-5xl
              "
            >
              Frequently Asked Questions
            </h2>

            <p className="mt-5 text-sm leading-7 text-gray-500 sm:text-base">
              Find quick answers to common questions about orders, payments, shipping and returns.
            </p>
          </div>

          <div
            className="
            mx-auto
            mt-10
            max-w-4xl
            space-y-4

            sm:mt-14
            "
          >
            {[
              {
                question: 'How long does shipping take?',
                answer:
                  'Standard shipping usually takes 3–7 business days depending on your location.',
              },
              {
                question: 'Can I return my order?',
                answer: 'Yes. We offer a 30-day return policy on eligible products.',
              },
              {
                question: 'How can I track my order?',
                answer: 'You will receive tracking details through email and SMS.',
              },
              {
                question: 'Which payment methods do you accept?',
                answer: 'We accept Visa, MasterCard, PayPal and digital payments.',
              },
            ].map((faq, index) => (
              <details
                key={index}
                className="
                cursor-pointer
                rounded-2xl
                border
                bg-white
                p-5
                shadow-sm

                sm:p-6
                "
              >
                <summary
                  className="
                  flex
                  items-center
                  justify-between
                  text-sm
                  font-semibold

                  sm:text-lg
                  "
                >
                  {faq.question}

                  <span className="text-xl">+</span>
                </summary>

                <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE SUPPORT */}

      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div
            className="
            rounded-[35px]
            bg-brand
            p-6
            text-white

            sm:p-10

            lg:p-16
            "
          >
            <div
              className="
              grid
              gap-10

              lg:grid-cols-2
              "
            >
              <div>
                <h2
                  className="
                  text-3xl
                  font-black

                  sm:text-5xl
                  "
                >
                  Chat With Our
                  <br />
                  Support Team
                </h2>

                <p className="mt-5 text-sm leading-7 text-gray-300 sm:text-base">
                  Our customer success team is available to answer your questions and provide
                  shopping assistance.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <a
                    href="mailto:sohaibmaqsoodsohaibmaqsood@gmail.com"
                    className="rounded-full bg-white px-8 py-3 text-center font-semibold text-black"
                  >
                    Email Support
                  </a>

                  <a href="/stylist" className="rounded-full border border-white px-8 py-3 text-center">
                    Ask the AI Stylist
                  </a>
                </div>
              </div>

              <div className="flex justify-center">
                <div
                  className="
                  flex
                  h-64
                  w-64
                  items-center
                  justify-center
                  rounded-full
                  bg-white/10

                  sm:h-80
                  sm:w-80
                  "
                >
                  <div className="text-center">
                    <div className="text-6xl">💬</div>

                    <h3 className="mt-5 text-xl font-bold">24/7 Support</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}