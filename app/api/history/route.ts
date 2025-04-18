import { NextRequest, NextResponse } from 'next/server'
import { getUserPredictions } from '../../services/db-service'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required parameter: userId' },
        { status: 400 }
      )
    }
    
    const predictions = await getUserPredictions(userId)
    
    return NextResponse.json({
      predictions
    })
  } catch (error) {
    console.error('Error fetching predictions history:', error)
    
    return NextResponse.json(
      { error: 'Failed to fetch prediction history' },
      { status: 500 }
    )
  }
} 