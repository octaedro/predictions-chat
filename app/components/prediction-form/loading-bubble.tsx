'use client'

import Image from 'next/image'
import { Star } from './types'

interface LoadingBubbleProps {
  selectedStar: Star | null
}

export function LoadingBubble({ selectedStar }: LoadingBubbleProps) {
  if (!selectedStar) return null
  
  return (
    <div className="flex justify-start animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-gradient-to-br from-zinc-700 to-zinc-800 text-white max-w-[85%] rounded-2xl px-4 py-3 rounded-tl-none shadow-md border border-zinc-600/30">
        <div className="flex items-center mb-2 pb-2 border-b border-zinc-600/30">
          <div className="relative w-9 h-9 mr-2 overflow-hidden rounded-full border-2 border-zinc-600/50 shadow-inner">
            <Image 
              src={selectedStar.image} 
              alt={selectedStar.name} 
              fill 
              className="object-cover"
            />
          </div>
          <span className="font-semibold text-sm">{selectedStar.name}</span>
        </div>
        <div className="flex space-x-2 items-center h-6 px-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
        </div>
      </div>
    </div>
  )
} 