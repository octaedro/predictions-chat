'use client'

import Image from 'next/image'
import { MessageType } from './types'

interface MessageBubbleProps {
  message: MessageType
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUserMessage = message.type === 'user'
  
  return (
    <div 
      className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-300`}
    >
      <div 
        className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md ${
          isUserMessage 
            ? 'bg-gradient-to-br bg-purple-700 text-white rounded-tr-none' 
            : 'bg-gradient-to-br from-zinc-500 to-zinc-700 text-white rounded-tl-none border border-zinc-100/30'
        }`}
      >
        {message.type === 'star' && message.star && (
          <div className="flex items-center mb-2 pb-2 border-b border-zinc-100/30">
            <div className="relative w-9 h-9 mr-2 overflow-hidden rounded-full border-2 border-zinc-600/50 shadow-inner">
              <Image 
                src={message.star.image} 
                alt={message.star.name} 
                fill 
                className="object-cover"
              />
            </div>
            <span className="font-semibold text-sm">{message.star.name}</span>
          </div>
        )}
        <div className="text-sm md:text-base leading-relaxed">
          {message.content}
        </div>
        <div className="text-right mt-1">
          <span className="text-xs opacity-70">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  )
} 