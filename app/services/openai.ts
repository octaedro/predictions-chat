import { STARS } from '../api/config/stars'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Types
interface OpenAIConfig {
  apiKey: string
  model: string
  temperature: number
  maxTokens: number
  apiUrl: string
}

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface OpenAIRequest {
  model: string
  messages: OpenAIMessage[]
  temperature: number
  max_tokens: number
}

interface OpenAIResponse {
  choices?: Array<{
    message?: {
      content?: string
    }
  }>
  error?: {
    message: string
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ValidationError'
  }
}

// Load environment file (.env.local)
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

// Initialize configuration
function initializeConfig(): OpenAIConfig {
  // Load environment variables
  loadEnvFile()
  
  const config: OpenAIConfig = {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '300', 10),
    apiUrl: process.env.OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions'
  }
  
  return config
}

// Config singleton
const CONFIG = initializeConfig()

/**
 * Validates user input for prediction requests
 */
export async function validatePredictionRequest(
  input: { question: string, starId?: string }
): Promise<void> {
  const { question } = input
  
  if (!question || typeof question !== 'string' || question.trim().length === 0) {
    throw new ValidationError('Text is required')
  }

  if (question.length > 500) {
    throw new ValidationError('Text cannot be longer than 500 characters')
  }
}

/**
 * Gets persona description for a specific star
 */
export function getPersonaDescription(starId: string): string {
  const description = STARS.get(starId) || 'You will predict the future.'
  return `${description} Predict the future with your unique perspective.`
}

/**
 * Makes prediction request to OpenAI API
 */
export async function getPrediction(
  { question, starId }: { question: string; starId?: string }
): Promise<string> {
  try {
    // Ensure API key is configured
    if (!CONFIG.apiKey) {
      throw new Error('OpenAI API key is not set in .env.local file. Please add OPENAI_API_KEY and restart the server.')
    }

    // Build request payload
    const description = starId ? getPersonaDescription(starId) : 'You will predict the future.'
    const requestData: OpenAIRequest = {
      model: CONFIG.model,
      messages: [
        { role: 'system', content: description },
        { role: 'user', content: question }
      ],
      temperature: CONFIG.temperature,
      max_tokens: CONFIG.maxTokens
    }
    
    // Make API request
    const response = await fetch(CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${CONFIG.apiKey}`
      },
      body: JSON.stringify(requestData)
    })

    // Parse response
    const data = await response.json() as OpenAIResponse
    
    // Handle API errors
    if (!response.ok) {
      console.error('OpenAI API error:', data)
      throw new Error(data.error?.message || 'Failed to generate prediction')
    }

    // Extract content from response
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