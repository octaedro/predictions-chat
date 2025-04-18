import { NextRequest, NextResponse } from 'next/server';
import { ValidationError, validatePredictionRequest, getPrediction } from '../../services/openai';
import { savePrediction } from '../../services/db-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { starId, question, userId } = body;
    
    if (!question) {
      return NextResponse.json(
        { error: 'Missing required field: question' },
        { status: 400 }
      );
    }

    // Validate the request
    await validatePredictionRequest({ question, starId, userId });
    
    // Get the prediction, passing the user's history
    const prediction = await getPrediction({ question, starId, userId });
    
    // Save the prediction to the database if userId is provided
    if (userId) {
      await savePrediction({
        userId,
        question,
        prediction,
        starId: starId || 'unknown'
      });
    }

    return NextResponse.json({ prediction });
  } catch (error) {
    console.error('Error in prediction API:', error);
    
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    if (error instanceof Error && error.message.includes('OpenAI API key')) {
      return NextResponse.json(
        { error: 'OpenAI API is not configured on the server. Please contact the administrator.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
} 