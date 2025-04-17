'use client'

import { useRef, useEffect } from 'react'
import { MessageType } from './types'
import { MessageBubble } from './message-bubble'
import { LoadingBubble } from './loading-bubble'
import { Star } from './types'

interface MessageListProps {
  messages: MessageType[]
  isLoading: boolean
  selectedStar: Star | null
}

export function MessageList({ messages, isLoading, selectedStar }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0 && !isLoading) return null

  return (
    <div className="mt-8 mb-6 space-y-6 bg-zinc-100/70 rounded-xl border border-zinc-100/50 shadow-lg p-6">
      {messages.map(message => (
        <MessageBubble key={message.id} message={message} />
      ))}
      
      {isLoading && (
        <LoadingBubble selectedStar={selectedStar} />
      )}
      <div ref={messagesEndRef} />
    </div>
  )
} 