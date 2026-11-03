type PropsStarRating = {
  rating: number
  size?: 'sm' | 'md'
  showValue?: boolean
}

export const StarRating = ({ rating, size = 'md', showValue = true }: PropsStarRating) => {
  const starSize = size === 'sm' ? 'text-[13px]' : 'text-[12px] sm:text-[15px] md:text-[18px]'

  return (
    <div className="flex items-center gap-1" role="img" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => {
          const full = rating >= star
          const half = rating >= star - 0.5 && rating < star

          return (
            <span key={star} className={`relative inline-block leading-none ${starSize}`}>
              {full ? (
                <span className="text-amber-400">★</span>
              ) : half ? (
                <>
                  <span className="text-lavender-300">★</span>

                  <span
                    className="absolute left-0 top-0 overflow-hidden text-amber-400"
                    style={{ width: '50%' }}
                  >
                    ★
                  </span>
                </>
              ) : (
                <span className="text-lavender-300">★</span>
              )}
            </span>
          )
        })}
      </div>

      {showValue && (
        <span className="text-[10px] font-medium text-gray-500 sm:text-xs md:text-sm">{rating.toFixed(1)}/5</span>
      )}
    </div>
  )
}
