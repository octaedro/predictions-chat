import { NextResponse } from 'next/server'
import { ValidationError, validatePredictionRequest, getPrediction } from '../services/openai'

export async function POST(request: Request) {
  try {
    const { text, starId } = await request.json()
    
    // Validate request
    await validatePredictionRequest(text)
    
    // Get prediction
    const prediction = await getPrediction(text, starId)
    
    return NextResponse.json({ prediction })
  } catch (error) {
    console.error('Prediction Error:', error)
    
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json(
      { error: 'Failed to get prediction' },
      { status: 500 }
    )
  }
} 