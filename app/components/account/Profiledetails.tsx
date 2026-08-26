import React from 'react'

export const Profiledetails = () => {
  return (
    <div
      className="
      lg:col-span-3
      space-y-4
      sm:space-y-6
      lg:space-y-8
      p-3
      sm:p-5
      lg:p-0
      "
    >
      {/* Profile Header */}

      <div
        className="
        border
        rounded-2xl
        sm:rounded-3xl
        p-4
        sm:p-6
        lg:p-8
        flex
        flex-col
        md:flex-row
        items-center
        gap-4
        sm:gap-6
        "
      >
        <div
          className="
          h-20
          w-20
          sm:h-24
          sm:w-24
          lg:h-28
          lg:w-28
          rounded-full
          bg-gray-200
          flex
          items-center
          justify-center
          text-3xl
          sm:text-4xl
          lg:text-5xl
          "
        >
          <i className="fa-regular fa-user"></i>
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1
            className="
            text-xl
            sm:text-2xl
            lg:text-3xl
            font-bold
            "
          >
            Muhammad Sohaib Maqsood
          </h1>

          <p
            className="
            text-sm
            sm:text-base
            text-gray-500
            mt-1
            "
          >
            sohaib@example.com
          </p>

          <button
            className="
            mt-3
            sm:mt-5
            bg-black
            text-white
            px-5
            sm:px-6
            py-2
            sm:py-3
            text-sm
            sm:text-base
            rounded-full
            hover:bg-gray-800
            transition
            "
          >
            Change Photo
          </button>
        </div>
      </div>

      {/* Profile Form */}

      <div
        className="
        border
        rounded-2xl
        sm:rounded-3xl
        p-4
        sm:p-6
        lg:p-8
        "
      >
        <h2
          className="
          text-xl
          sm:text-2xl
          font-bold
          mb-4
          sm:mb-6
          "
        >
          Personal Information
        </h2>

        <form
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-4
          sm:gap-6
          "
        >
          {[
            {
              label: 'Full Name',
              type: 'text',
              placeholder: 'Muhammad Sohaib',
            },
            {
              label: 'Email',
              type: 'email',
              placeholder: 'sohaib@example.com',
            },
            {
              label: 'Phone Number',
              type: 'text',
              placeholder: '+92 300 1234567',
            },
            {
              label: 'Country',
              type: 'text',
              placeholder: 'Pakistan',
            },
            {
              label: 'City',
              type: 'text',
              placeholder: 'Lahore',
            },
          ].map((item, index) => (
            <div key={index}>
              <label
                className="
                  text-sm
                  sm:text-base
                  font-medium
                  block
                  mb-1
                  sm:mb-2
                  "
              >
                {item.label}
              </label>

              <input
                type={item.type}
                placeholder={item.placeholder}
                className="
                w-full
                bg-[#F0F0F0]
                rounded-full
                px-4
                sm:px-5
                py-3
                sm:py-4
                text-sm
                sm:text-base
                outline-none
                "
              />
            </div>
          ))}

          {/* Gender */}

          <div>
            <label
              className="
              text-sm
              sm:text-base
              font-medium
              block
              mb-1
              sm:mb-2
              "
            >
              Gender
            </label>

            <select
              className="
              w-full
              bg-[#F0F0F0]
              rounded-full
              px-4
              sm:px-5
              py-3
              sm:py-4
              text-sm
              sm:text-base
              outline-none
              "
            >
              <option>Male</option>

              <option>Female</option>
            </select>
          </div>

          {/* Address */}

          <div
            className="
            md:col-span-2
            "
          >
            <label
              className="
              text-sm
              sm:text-base
              font-medium
              block
              mb-1
              sm:mb-2
              "
            >
              Address
            </label>

            <textarea
              rows={3}
              placeholder="Enter your address..."
              className="
            w-full
            bg-[#F0F0F0]
            rounded-2xl
            sm:rounded-3xl
            px-4
            sm:px-5
            py-3
            sm:py-4
            text-sm
            sm:text-base
            outline-none
            resize-none
            "
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              className="
            bg-black
            text-white
            rounded-full
            px-7
            sm:px-10
            py-3
            sm:py-4
            text-sm
            sm:text-base
            hover:bg-gray-800
            transition
            "
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Change Password */}

      <div
        className="
        border
        rounded-2xl
        sm:rounded-3xl
        p-4
        sm:p-6
        lg:p-8
        "
      >
        <h2
          className="
          text-xl
          sm:text-2xl
          font-bold
          mb-4
          sm:mb-6
          "
        >
          Change Password
        </h2>

        <form
          className="
          space-y-3
          sm:space-y-5
          "
        >
          {['Current Password', 'New Password', 'Confirm New Password'].map(
            (placeholder, index) => (
              <input
                key={index}
                type="password"
                placeholder={placeholder}
                className="
              w-full
              bg-[#F0F0F0]
              rounded-full
              px-4
              sm:px-5
              py-3
              sm:py-4
              text-sm
              sm:text-base
              outline-none
              "
              />
            )
          )}

          <button
            type="submit"
            className="
          bg-black
          text-white
          rounded-full
          px-6
          sm:px-8
          py-3
          sm:py-4
          text-sm
          sm:text-base
          hover:bg-gray-800
          transition
          "
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  )
}
