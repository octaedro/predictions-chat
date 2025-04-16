export const OPENAI_CONFIG = {
  model: "gpt-3.5-turbo",
  description: "You are Michael Jackson and you will predict the future",
  temperature: "flying imagination",
  OPENAI_API_KEY: "sk-proj-1234567890",
} as const

export interface PredictionPayload {
  description: string
  temperature: string
  question: string
} 