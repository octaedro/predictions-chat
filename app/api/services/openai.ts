import { promises as fs } from 'fs'
import path from 'path'
import { STARS } from '../config/stars'

interface OpenAIConfig {
  apiKey: string
  model: string
}

// Initialize with the key from environment variables
export const OPENAI_CONFIG: OpenAIConfig = {
  apiKey: process.env.OPENAI_API_KEY || '',
  model: 'gpt-3.5-turbo',
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

export async function validatePredictionRequest(text: string): Promise<void> {
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    throw new ValidationError('Text is required')
  }

  if (text.length > 500) {
    throw new ValidationError('Text cannot be longer than 500 characters')
  }
}

export function getPersonaDescription(starId: string): string {
  const description = STARS.get(starId) || 'You will predict the future.'
  return `${description} Predict the future with your unique perspective.`
}

export async function getPrediction(question: string, starId?: string): Promise<string> {
  try {
    // Ensure API key is set
    if (!OPENAI_CONFIG.apiKey) {
      throw new Error('OpenAI API key is not set. Please add OPENAI_API_KEY to your .env.local file.')
    }

    const description = starId ? getPersonaDescription(starId) : 'You will predict the future.'
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_CONFIG.model,
        messages: [
          {
            role: 'system',
            content: description,
          },
          {
            role: 'user',
            content: question,
          },
        ],
        temperature: 0.7,
        max_tokens: 300,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('OpenAI API error:', data)
      throw new Error(data.error?.message || 'Failed to generate prediction')
    }

    return data.choices[0]?.message?.content || 'No prediction was generated'
  } catch (error) {
    console.error('Error getting prediction:', error)
    throw error
  }
} 