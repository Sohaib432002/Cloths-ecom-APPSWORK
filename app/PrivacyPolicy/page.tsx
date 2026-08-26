'use client'

const PrivacyPolicy = () => {
  const policies = [
    {
      title: 'Information We Collect',
      description:
        'We collect information you provide, such as your name, email address, phone number, shipping address, and payment details when you place an order or create an account.',
    },
    {
      title: 'How We Use Your Information',
      description:
        'Your information is used to process orders, improve our services, provide customer support, and send important updates regarding your purchases.',
    },
    {
      title: 'Data Security',
      description:
        'We implement industry-standard security measures to protect your personal information from unauthorized access, disclosure, or misuse.',
    },
    {
      title: 'Cookies',
      description:
        'Our website uses cookies to enhance your browsing experience, remember your preferences, and analyze website traffic.',
    },
    {
      title: 'Third-Party Services',
      description:
        'We may share limited information with trusted payment gateways and shipping partners solely for completing your orders.',
    },
    {
      title: 'Your Rights',
      description:
        'You may request access, correction, or deletion of your personal information at any time by contacting our support team.',
    },
    {
      title: 'Policy Updates',
      description:
        'We may update this Privacy Policy periodically. Any changes will be published on this page with the latest revision date.',
    },
    {
      title: 'Contact Us',
      description:
        'If you have any questions regarding this Privacy Policy, please contact our customer support team.',
    },
  ]

  return (
    <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
      <div
        className="
        mx-auto
        max-w-6xl
        px-4

        sm:px-6

        lg:px-8
        "
      >
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
            Your Privacy Matters
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
            Privacy Policy
          </h1>

          <p
            className="
            mx-auto
            mt-4
            max-w-3xl

            text-sm
            leading-7
            text-gray-600

            sm:mt-5
            sm:text-base
            sm:leading-8

            lg:text-lg
            "
          >
            We value your privacy and are committed to protecting your personal information. This
            Privacy Policy explains how we collect, use, and safeguard your data when you use
            SHOP.CO.
          </p>

          <p
            className="
            mt-4
            text-xs
            text-gray-500

            sm:text-sm
            "
          >
            Last Updated: July 2026
          </p>
        </div>

        {/* Policy Cards */}

        <div
          className="
          mt-10

          grid
          grid-cols-1
          gap-5

          sm:mt-12

          md:grid-cols-2

          lg:gap-6
          "
        >
          {policies.map((policy, index) => (
            <div
              key={index}
              className="
              rounded-3xl
              border
              bg-white

              p-5

              sm:p-6

              lg:p-8

              shadow-sm
              transition

              hover:-translate-y-1
              hover:shadow-lg
              "
            >
              <div
                className="
                flex
                items-center
                gap-3

                sm:gap-4
                "
              >
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
                  {policy.title}
                </h2>
              </div>

              <p
                className="
                mt-4

                text-sm
                leading-7
                text-gray-600

                sm:mt-5
                sm:text-base
                sm:leading-8
                "
              >
                {policy.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default PrivacyPolicy
