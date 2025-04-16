import { STARS } from '../config/stars'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Directly load .env.local from root
function loadEnvFile(): void {
  try {
    const envPath = path.resolve(process.cwd(), '.env.local')
    if (fs.existsSync(envPath)) {
      const envConfig = dotenv.parse(fs.readFileSync(envPath))
      for (const k in envConfig) {
        process.env[k] = envConfig[k]
      }
    } else {
      console.warn('No .env.local file found at:', envPath)
    }
  } catch (error) {
    console.error('Error loading .env.local file:', error)
  }
}

// Load environment variables
loadEnvFile()

interface OpenAIConfig {
  apiKey: string
  model: string
}

// Initialize with the key from environment variables
export const OPENAI_CONFIG: OpenAIConfig = {
  apiKey: process.env.OPENAI_API_KEY || '',
  model: 'gpt-3.5-turbo',
}

// Log config status
console.log(`OpenAI API key status: ${OPENAI_CONFIG.apiKey ? 'Set' : 'Not set'}`)
if (!OPENAI_CONFIG.apiKey) {
  console.error('WARNING: OPENAI_API_KEY is not set! Predictions will not work.')
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
    // Double-check API key
    if (!OPENAI_CONFIG.apiKey) {
      throw new Error('OpenAI API key is not set in .env.local file. Please add OPENAI_API_KEY and restart the server.')
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

    // Properly extract content from the message
    const content = data.choices?.[0]?.message?.content
    
    if (!content) {
      console.error('No content in OpenAI response:', JSON.stringify(data, null, 2))
      return 'No prediction was generated'
    }
    
    return content
  } catch (error) {
    console.error('Error getting prediction:', error)
    throw error
  }
} 