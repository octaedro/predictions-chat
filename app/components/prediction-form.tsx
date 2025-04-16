'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useSelectedStar } from '../hooks/use-selected-star'
import { StarSelector } from './star-selector'

interface Message {
  id: string
  content: string
  type: 'user' | 'star'
  timestamp: Date
  star?: {
    id: string
    name: string
    image: string
  }
}

export function PredictionForm() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { selectedStarId, selectedStar } = useSelectedStar()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleQuestionChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuestion(e.target.value)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim() || !selectedStarId || !selectedStar) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: question.trim(),
      type: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          starId: selectedStar.id,
          question: question.trim()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate prediction')
      }

      const starMessage: Message = {
        id: `star-${Date.now()}`,
        content: data.prediction,
        type: 'star',
        timestamp: new Date(),
        star: selectedStar
      }

      setMessages(prev => [...prev, starMessage])
      setQuestion('') // Clear input after sending
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate prediction. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <StarSelector />
      
      {/* Chat Messages - only shown if there are messages */}
      {(messages.length > 0 || isLoading) && (
        <div className="mt-8 mb-6 space-y-6 bg-zinc-800/70 rounded-xl border border-zinc-700/50 shadow-lg p-6">
          {messages.map(message => (
            <div 
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-4 duration-300`}
            >
              <div 
                className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-tr-none' 
                    : 'bg-gradient-to-br from-zinc-700 to-zinc-800 text-white rounded-tl-none border border-zinc-600/30'
                }`}
              >
                {message.type === 'star' && message.star && (
                  <div className="flex items-center mb-2 pb-2 border-b border-zinc-600/30">
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
          ))}
          
          {isLoading && (
            <div className="flex justify-start animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="bg-gradient-to-br from-zinc-700 to-zinc-800 text-white max-w-[85%] rounded-2xl px-4 py-3 rounded-tl-none shadow-md border border-zinc-600/30">
                <div className="flex items-center mb-2 pb-2 border-b border-zinc-600/30">
                  {selectedStar && (
                    <div className="relative w-9 h-9 mr-2 overflow-hidden rounded-full border-2 border-zinc-600/50 shadow-inner">
                      <Image 
                        src={selectedStar.image} 
                        alt={selectedStar.name} 
                        fill 
                        className="object-cover"
                      />
                    </div>
                  )}
                  <span className="font-semibold text-sm">{selectedStar?.name}</span>
                </div>
                <div className="flex space-x-2 items-center h-6 px-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '600ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
      
      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-500/10 rounded-xl border border-red-500/20 shadow-md animate-in fade-in duration-300">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      
      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 mt-6">
        <Input
          type="text"
          placeholder={selectedStarId ? "Ask your question..." : "Select a star first..."}
          value={question}
          onChange={handleQuestionChange}
          disabled={isLoading || !selectedStarId}
          className={`flex-1 h-12 rounded-xl border-zinc-300 transition-all duration-200 
            ${!selectedStarId 
              ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' 
              : 'bg-white text-black focus:border-purple-500 focus:ring-purple-500/20'} 
            placeholder:text-zinc-500`}
        />
        <Button
          type="submit"
          disabled={isLoading || !question.trim() || !selectedStarId}
          className="h-12 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 transition-colors"
        >
          {isLoading ? 'Predicting...' : 'Predict'}
        </Button>
      </form>
    </div>
  )
} 