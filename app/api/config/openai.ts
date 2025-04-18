export const OPENAI_CONFIG = {
  model: "gpt-3.5-turbo",
  temperature: "flying imagination",
  maxTokens: 100,
} as const

export interface PredictionPayload {
  description: string
  temperature: string
  question: string
} 