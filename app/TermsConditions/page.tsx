'use client'

const TermsConditions = () => {
  const terms = [
    {
      title: 'Acceptance of Terms',
      description:
        'By accessing and using SHOP.CO, you agree to be bound by these Terms & Conditions and all applicable laws.',
    },
    {
      title: 'Orders & Payments',
      description:
        'All orders are subject to product availability. Payments must be completed successfully before your order is processed.',
    },
    {
      title: 'Shipping & Delivery',
      description:
        'Estimated delivery times are provided for convenience and may vary depending on your location and courier services.',
    },
    {
      title: 'Returns & Refunds',
      description:
        'Eligible products can be returned or exchanged according to our Return Policy within the specified period.',
    },
    {
      title: 'User Accounts',
      description:
        'You are responsible for maintaining the confidentiality of your account information and password.',
    },
    {
      title: 'Intellectual Property',
      description:
        'All content, including logos, images, text, and designs on SHOP.CO, is protected by copyright and may not be reproduced without permission.',
    },
    {
      title: 'Limitation of Liability',
      description:
        'SHOP.CO shall not be liable for any indirect, incidental, or consequential damages arising from the use of this website.',
    },
    {
      title: 'Changes to Terms',
      description:
        'We reserve the right to modify these Terms & Conditions at any time. Continued use of the website constitutes acceptance of the updated terms.',
    },
  ]

  return (
    <section className="bg-gray-50 py-10 sm:py-14 lg:py-20">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Header */}

        <div className="text-center">
          <span
            className="
            inline-block
            rounded-full
            bg-black
            px-4
            py-2
            text-xs
            font-medium
            text-white
            sm:px-5
            sm:text-sm
            "
          >
            Legal Information
          </span>

          <h1
            className="
            mt-5
            text-3xl
            font-black
            sm:text-4xl
            lg:text-5xl
            "
          >
            Terms & Conditions
          </h1>

          <p
            className="
            mx-auto
            mt-4
            max-w-3xl
            text-sm
            leading-6
            text-gray-600
            sm:text-base
            sm:leading-7
            lg:text-lg
            "
          >
            Please read these Terms & Conditions carefully before using SHOP.CO. By accessing our
            website, you agree to comply with the following terms.
          </p>

          <p className="mt-3 text-xs text-gray-500 sm:text-sm">Last Updated: July 2026</p>
        </div>

        {/* Terms Cards */}

        <div
          className="
          mt-8
          grid
          grid-cols-1
          gap-4
          sm:mt-12
          sm:gap-6
          md:grid-cols-2
          "
        >
          {terms.map((item, index) => (
            <div
              key={index}
              className="
              rounded-2xl
              border
              bg-white
              p-5
              shadow-sm
              transition
              hover:-translate-y-1
              hover:shadow-lg
              sm:rounded-3xl
              sm:p-7
              lg:p-8
              "
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div
                  className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-black
                  text-sm
                  font-bold
                  text-white
                  sm:h-12
                  sm:w-12
                  sm:text-lg
                  "
                >
                  {index + 1}
                </div>

                <h2
                  className="
                  text-lg
                  font-bold
                  sm:text-xl
                  lg:text-2xl
                  "
                >
                  {item.title}
                </h2>
              </div>

              <p
                className="
                mt-4
                text-sm
                leading-6
                text-gray-600
                sm:mt-5
                sm:text-base
                sm:leading-8
                "
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Contact */}

        <div
          className="
          mt-10
          rounded-3xl
          bg-black
          p-5
          text-center
          text-white
          sm:mt-14
          sm:p-8
          lg:mt-16
          lg:rounded-[35px]
          lg:p-10
          "
        >
          <h2
            className="
            text-2xl
            font-black
            sm:text-3xl
            "
          >
            Questions About These Terms?
          </h2>

          <p
            className="
            mx-auto
            mt-3
            max-w-2xl
            text-sm
            leading-6
            text-gray-300
            sm:mt-4
            sm:text-base
            "
          >
            If you have any questions regarding our Terms & Conditions, feel free to contact our
            support team.
          </p>

          <div
            className="
            mt-6
            grid
            grid-cols-1
            gap-5
            sm:mt-8
            sm:grid-cols-3
            "
          >
            <div>
              <p className="text-xs text-gray-400 sm:text-sm">Email</p>

              <p className="text-sm font-semibold sm:text-base">support@shop.co</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 sm:text-sm">Phone</p>

              <p className="text-sm font-semibold sm:text-base">+1 (234) 567-890</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 sm:text-sm">Working Hours</p>

              <p className="text-sm font-semibold sm:text-base">Mon - Fri | 9:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TermsConditions
