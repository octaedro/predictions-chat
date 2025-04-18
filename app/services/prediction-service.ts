'use client'

import { getUserId } from './user-service'

interface PredictionRequest {
  starId: string
  question: string
}

export async function getPrediction({ starId, question }: PredictionRequest): Promise<string> {
  // Get the user ID from localStorage
  const userId = getUserId()
  
  const response = await fetch('/api/predictions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      starId,
      question,
      userId
    })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate prediction')
  }

  return data.prediction
}

/**
 * Clears all history for a user
 */
export async function clearHistory(userId: string): Promise<boolean> {
  try {
    const response = await fetch(`/api/clear-history?userId=${encodeURIComponent(userId)}`, {
      method: 'DELETE',
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Failed to clear history')
    }

    return true
  } catch (error) {
    console.error('Error clearing history:', error)
    throw error
  }
} 