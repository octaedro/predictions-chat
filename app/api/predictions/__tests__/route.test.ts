// Mock dependencies
jest.mock('../../../services/openai', () => ({
  validatePredictionRequest: jest.fn(),
  getPrediction: jest.fn().mockResolvedValue('Test Prediction'),
  ValidationError: class ValidationError extends Error {}
}))

// Mock db-service to avoid Prisma initialization
jest.mock('../../../services/db-service', () => ({
  savePrediction: jest.fn().mockResolvedValue({}),
  getUserPredictions: jest.fn().mockResolvedValue([]),
  deleteUserPredictions: jest.fn().mockResolvedValue({})
}))

describe('Predictions API route', () => {
  test('API route should exist', () => {
    // Verifies that the API route is defined and is a function
    const { POST } = require('../route')
    expect(typeof POST).toBe('function')
  })
}) 