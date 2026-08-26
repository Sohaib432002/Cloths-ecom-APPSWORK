type PropsStarRating = {
  rating: number
}

export const StarRating = ({ rating }: PropsStarRating) => {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          const full = rating >= star
          const half = rating >= star - 0.5 && rating < star

          return (
            <span
              key={star}
              className="relative inline-block text-[12px] xs:text-[13px] sm:text-[15px] md:text-[18px]"
            >
              {full ? (
                <span className="text-yellow-400">★</span>
              ) : half ? (
                <>
                  <span className="text-gray-300">★</span>

                  <span
                    className="absolute left-0 top-0 overflow-hidden text-yellow-400"
                    style={{ width: '50%' }}
                  >
                    ★
                  </span>
                </>
              ) : (
                <span className="text-gray-300">★</span>
              )}
            </span>
          )
        })}
      </div>

      <span className="text-[10px] xs:text-[11px] sm:text-xs md:text-sm font-medium text-gray-500">
        {rating.toFixed(1)}/5
      </span>
    </div>
  )
}
