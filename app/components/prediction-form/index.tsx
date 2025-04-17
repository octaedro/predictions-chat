'use client'

import { useState } from 'react'
import { useSelectedStar } from '../../hooks/use-selected-star'
import { StarSelector } from '../star-selector'
import { MessageList } from './message-list'
import { ErrorMessage } from './error-message'
import { QuestionInput } from './question-input'
import { getPrediction } from '../../services/prediction-service'
import { MessageType } from './types'

export function PredictionForm() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<MessageType[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { selectedStarId, selectedStar } = useSelectedStar()

  function handleQuestionChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuestion(e.target.value)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim() || !selectedStarId || !selectedStar) return

    const userMessage: MessageType = {
      id: `user-${Date.now()}`,
      content: question.trim(),
      type: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)
    setError('')
    
    try {
      const prediction = await getPrediction({
        starId: selectedStar.id,
        question: question.trim()
      })

      const starMessage: MessageType = {
        id: `star-${Date.now()}`,
        content: prediction,
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
      
      <MessageList 
        messages={messages}
        isLoading={isLoading}
        selectedStar={selectedStar || null}
      />
      
      <ErrorMessage error={error} />
      
      <QuestionInput
        question={question}
        onChange={handleQuestionChange}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        selectedStarId={selectedStarId}
      />
    </div>
  )
} 