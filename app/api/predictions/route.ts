import { NextResponse } from 'next/server';
import { ValidationError, validatePredictionRequest, getPrediction } from '../services/openai';

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { starId, question } = body
    
    if (!starId || !question) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    await validatePredictionRequest(question)
    const prediction = await getPrediction(question, starId)

    return NextResponse.json({ prediction })
  } catch (error) {
    console.error('Error in prediction API:', error)
    
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
} 