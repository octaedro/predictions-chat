'use client'

import { useState } from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { useSelectedStar } from '../hooks/use-selected-star'
import { StarSelector } from './star-selector'

export function PredictionForm() {
  const [question, setQuestion] = useState('')
  const [prediction, setPrediction] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { selectedStarId } = useSelectedStar()

  function handleQuestionChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuestion(e.target.value)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!question.trim() || !selectedStarId) return

    setIsLoading(true)
    setError('')
    setPrediction('')

    try {
      const response = await fetch('/api/predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          starId: selectedStarId,
          question: question.trim()
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate prediction')
      }

      setPrediction(data.prediction)
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate prediction. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <StarSelector />
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Ask your question..."
            value={question}
            onChange={handleQuestionChange}
            disabled={isLoading}
            className="flex-1 h-10"
          />
          <Button
            type="submit"
            disabled={isLoading || !question.trim() || !selectedStarId}
            className="h-10 bg-purple-500 hover:bg-purple-600"
          >
            {isLoading ? 'Predicting...' : 'Predict'}
          </Button>
        </div>
      </form>
      
      {error && (
        <div className="mt-6 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
          <p className="text-red-500">{error}</p>
        </div>
      )}
      
      {prediction && (
        <div className="mt-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <h3 className="text-lg font-medium mb-2">Prediction:</h3>
          <p className="text-white/80">{prediction}</p>
        </div>
      )}
    </div>
  )
} 