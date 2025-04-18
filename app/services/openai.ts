import { STARS } from '../constants/stars'
import { getUserPredictions } from './db-service'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Types
interface OpenAIConfig {
  apiKey: string
  model: string
  temperature: number
  maxTokens: number
  maxContextLength: number
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
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '100', 10),
     // Set a reasonable character limit for context (about 2000-3000 tokens)
    maxContextLength: parseInt(process.env.OPENAI_MAX_CONTEXT_LENGTH || '8000', 10),
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
  input: { question: string, starId?: string, userId?: string }
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
 * Gets description for a specific star
 */
export function getDescription(starId?: string): string {
  if (!starId) return 'You will predict the future.'
  const starConfig = STARS.find(star => star.id === starId)
  const description = starConfig?.description
  return `${description} Predict the future with your unique perspective.`
}

/**
 * Builds a chat context from the prediction history
 * Prioritizes recent messages and trims older ones if needed
 */
function buildChatContext(userPredictions: any[], currentStarId: string, currentQuestion: string): string {
  if (!userPredictions.length) return ''
   
  // Get the names of the stars
  const getStarName = (id: string) => {
    const star = STARS.find(s => s.id === id)
    return star ? star.name : 'Celebrity'
  }
  
  // Format each prediction as conversation entries
  const conversationEntries = userPredictions.map(pred => {
    const starName = getStarName(pred.starId)
    return `User: ${pred.question}\n${starName}: ${pred.prediction}\n\n`
  })
  
  // Start with header
  let context = 'Here are our previous conversations:\n\n'
  
  // Add entries from newest to oldest until we hit the limit
  let remainingLength = CONFIG.maxContextLength - context.length
  let includedEntries = []
  
  for (let i = 0; i < conversationEntries.length; i++) {
    const entry = conversationEntries[i]
    
    if (entry.length <= remainingLength) {
      includedEntries.unshift(entry) // Add to beginning to maintain chronological order
      remainingLength -= entry.length
    } else if (i === conversationEntries.length - 1) {
      // If even the most recent message is too long, include a truncated version
      const truncatedEntry = entry.substring(0, remainingLength)
      includedEntries.push(truncatedEntry)
      remainingLength = 0
      break
    } else {
      // If this entry doesn't fit, skip it and keep checking older ones
      // (though they'll likely be too long as well)
      continue
    }
  }
  
  // Add all included entries to the context
  context += includedEntries.join('')

  // Add the current question to the context
  context += `\n\nUser: ${currentQuestion}\n` 
    
  return context
}

/**
 * Ensures the AI response text ends with a proper sentence.
 * Trims any incomplete sentences at the end of the text.
 */
function ensureCompleteSentence(text: string): string {
  if (!text) return text;
  
  // Find the last occurrence of sentence-ending punctuation
  const lastPeriodIndex = text.lastIndexOf('.');
  const lastQuestionIndex = text.lastIndexOf('?');
  const lastExclamationIndex = text.lastIndexOf('!');
  
  // Get the index of the last punctuation mark
  const lastIndex = Math.max(lastPeriodIndex, lastQuestionIndex, lastExclamationIndex);
  
  // If we found punctuation and it's not at the very end, trim the text
  if (lastIndex !== -1 && lastIndex < text.length - 1) {
    return text.substring(0, lastIndex + 1);
  }
  
  return text;
}

/**
 * Makes prediction request to OpenAI API
 */
export async function getPrediction(
  { question, starId, userId }: { question: string; starId?: string; userId?: string }
): Promise<string> {
  try {
    // Ensure API key is configured
    if (!CONFIG.apiKey) {
      throw new Error('OpenAI API key is not set in .env.local file. Please add OPENAI_API_KEY and restart the server.')
    }
    
    // Get user history if userId is provided
    let chatHistory = ''
    if (userId) {
      const userPredictions = await getUserPredictions(userId)
      chatHistory = buildChatContext(userPredictions, starId || '', question)
    }

    // Build request payload
    const description = starId ? getDescription(starId) : 'You will predict the future.'

    // Create system message with history context if available
    let systemContent = description
    if (chatHistory) {
      systemContent = `${description}\n\n${chatHistory}\nNow, continue our conversation by responding to the user's new question.`
    }
    
    const requestData: OpenAIRequest = {
      model: CONFIG.model,
      messages: [
        { role: 'system', content: systemContent },
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
    
    return ensureCompleteSentence(content);
  } catch (error) {
    console.error('Error getting prediction:', error)
    throw error
  }
} 