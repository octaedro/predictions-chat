'use client'

interface ErrorMessageProps {
  error: string
}

export function ErrorMessage({ error }: ErrorMessageProps) {
  if (!error) return null
  
  return (
    <div className="mb-4 p-4 bg-red-500/10 rounded-xl border border-red-500/20 shadow-md animate-in fade-in duration-300">
      <p className="text-red-400 text-sm">{error}</p>
    </div>
  )
} 