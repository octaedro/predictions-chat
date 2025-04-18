import { prisma } from '../lib/prisma'

interface PredictionData {
  userId: string
  question: string
  prediction: string
  starId: string
}

/**
 * Save a new prediction to the database
 */
export async function savePrediction(data: PredictionData) {
  try {
    return await prisma.prediction.create({
      data
    })
  } catch (error) {
    console.error('Error saving prediction:', error)
    throw error
  }
}

/**
 * Get all predictions for a specific user, sorted by timestamp descending
 */
export async function getUserPredictions(userId: string) {
  try {
    return await prisma.prediction.findMany({
      where: {
        userId
      },
      orderBy: {
        timestamp: 'desc'
      }
    })
  } catch (error) {
    console.error('Error getting user predictions:', error)
    throw error
  }
} 