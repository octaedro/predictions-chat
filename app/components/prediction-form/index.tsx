'use client'

import { useState, useEffect } from 'react'
import { useSelectedStar } from '../../hooks/use-selected-star'
import { StarSelector } from '../star-selector'
import { MessageList } from './message-list'
import { ErrorMessage } from './error-message'
import { QuestionInput } from './question-input'
import { getPrediction, clearHistory } from '../../services/prediction-service'
import { getUserId } from '../../services/user-service'
import { MessageType } from './types'

export function PredictionForm() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState<MessageType[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [clearSuccess, setClearSuccess] = useState(false)
  const { selectedStarId, selectedStar } = useSelectedStar()

  useEffect(() => {
    setUserId(getUserId())
  }, [])

  useEffect(() => {
    if (clearSuccess) {
      const timer = setTimeout(() => {
        setClearSuccess(false)
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [clearSuccess])

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

  async function handleClearHistory() {
    if (!userId || isLoading) return;

    // if the chat is empty, don't clear the history
    if (messages.length === 0) return;
    
    try {
      setIsLoading(true);
      await clearHistory(userId);
      setMessages([]);
      setClearSuccess(true);
    } catch (error) {
      console.error('Error clearing history:', error);
      setError('Failed to clear history. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col items-end mb-2 space-y-1">
        {userId && (
          <div className="text-xs text-zinc-500">
            User ID: {userId}
          </div>
        )}
        <div className="flex items-center gap-2">
          {clearSuccess && (
            <span className="text-xs text-green-500 animate-fadeOut">
              Done!
            </span>
          )}
          
          <button
            onClick={handleClearHistory}
            disabled={isLoading || !userId || messages.length === 0}
            className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Clear chat
          </button>
        </div>
      </div>
      
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