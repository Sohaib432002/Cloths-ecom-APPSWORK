'use client'

export const LoadingSpinner = ({
  size = 'md',
  text = 'Loading...',
}: {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}) => {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-[3px]',
    lg: 'w-14 h-14 border-4',
  }

  return (
    <div className="flex min-h-[250px] w-full flex-col items-center justify-center gap-4">
      <div className="relative">
        {/* Outer Ring */}
        <div className={`${sizes[size]} rounded-full border-gray-200`} />

        {/* Animated Ring */}
        <div
          className={`absolute inset-0 ${sizes[size]} animate-spin rounded-full border-transparent border-t-black border-r-black`}
        />
      </div>

      <div className="flex flex-col items-center">
        <p className="text-sm font-medium text-gray-700">{text}</p>

        <div className="mt-2 flex gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-black [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-black [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-black" />
        </div>
      </div>
    </div>
  )
}
