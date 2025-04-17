'use client'

interface PredictionRequest {
  starId: string
  question: string
}

export async function getPrediction({ starId, question }: PredictionRequest): Promise<string> {
  const response = await fetch('/api/predictions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      starId,
      question
    })
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate prediction')
  }

  return data.prediction
} 