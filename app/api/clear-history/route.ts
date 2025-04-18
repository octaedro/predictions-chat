import { NextRequest, NextResponse } from 'next/server'
import { deleteUserPredictions } from '../../services/db-service'

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required parameter: userId' },
        { status: 400 }
      )
    }
    
    // Delete the user's predictions
    await deleteUserPredictions(userId)
    
    return NextResponse.json({
      success: true,
      message: 'History cleared successfully'
    })
  } catch (error) {
    console.error('Error clearing user history:', error)
    
    return NextResponse.json(
      { error: 'Failed to clear history' },
      { status: 500 }
    )
  }
} 