interface ChatMessageProps {
  message: string
  isUser?: boolean
  isLoading?: boolean
}

export function ChatMessage({ message, isUser = false, isLoading = false }: ChatMessageProps) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          isUser
            ? 'bg-purple-700 text-white rounded-tr-none'
            : 'bg-gray-100 text-gray-800 rounded-tl-none'
        } ${isLoading ? 'animate-pulse' : ''}`}
      >
        {message}
      </div>
    </div>
  )
} 