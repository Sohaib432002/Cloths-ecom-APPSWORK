import React from 'react'

const Customstyles = () => {
  const styles = [
    {
      title: 'Casual',
      image: '/images/home/CustomStyles/image3.png',
      className: 'md:col-span-1',
    },
    {
      title: 'Formal',
      image: '/images/home/CustomStyles/image2.png',
      className: 'md:col-span-2',
    },
    {
      title: 'Party',
      image: '/images/home/CustomStyles/image4.png',
      className: 'md:col-span-2',
    },
    {
      title: 'Gym',
      image: '/images/home/CustomStyles/image1.png',
      className: 'md:col-span-1',
    },
  ]

  return (
    <section className="my-20">
      <div className="max-w-310 mx-auto bg-[#F4F0FF] rounded-3xl p-5 md:p-8">
        <h1 className="text-center text-3xl sm:text-4xl lg:text-5xl font-black mb-10">
          BROWSE BY DRESS STYLE
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {styles.map((item, index) => (
            <div
              key={index}
              className={`${item.className} group relative overflow-hidden rounded-3xl bg-white shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer`}
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-[300px] object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
              />

              {/* Dark Overlay */}
              <div className="absolute inset-0  from-black/30 via-transparent to-transparent"></div>

              {/* Text */}
              <h2 className="absolute top-6 left-6 z-10 text-3xl font-bold text-black">
                {item.title}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Customstyles
