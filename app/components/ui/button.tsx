interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
}

export function Button({ children, isLoading, className = '', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`h-10 px-8 font-medium text-white bg-purple-700 rounded-lg
        hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-700
        transition-colors duration-200
        sm:w-auto w-full ${className}`}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  )
} 