type Reviews = {
  name: string
  review: string
}

const ReviewCard = ({ name, review }: Reviews) => {
  return (
    <div
      className="
        flex
        h-full
        flex-col
        rounded-3xl
        border
        border-gray-200
        bg-white
        p-5
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-gray-300
        hover:shadow-xl
        sm:p-2
      "
    >
      {/* Rating */}

      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => (
          <span key={index} className="text-lg text-yellow-400 sm:text-xl">
            ★
          </span>
        ))}
      </div>

      {/* User */}

      <div className="mt-4 flex items-center gap-2">
        <h2 className="text-lg font-bold text-black sm:text-xl">{name}</h2>

        <span
          className="
            flex
            h-5
            w-5
            items-center
            justify-center
            rounded-full
            bg-green-500
            text-xs
            font-bold
            text-white
          "
        >
          ✓
        </span>

        <span className="text-xs font-medium text-green-600">Verified Buyer</span>
      </div>

      {/* Review */}

      <p
        className="
          mt-4
          flex-1
          text-sm
          leading-7
          text-gray-600
          sm:text-base
        "
      >
        "{review}"
      </p>
    </div>
  )
}

export default ReviewCard
