import React from 'react'
import { render, screen } from '@testing-library/react'
import { PredictionForm } from '../index'
import { Provider } from 'react-redux'
import { store } from '../../../store'

// Mock the prediction service
jest.mock('../../../services/prediction-service', () => ({
  getPrediction: jest.fn()
}))

// Create simple mocks for child components
jest.mock('../../star-selector', () => ({
  StarSelector: () => <div data-testid="star-selector">Star Selector Mock</div>
}))

jest.mock('../message-list', () => ({
  MessageList: () => <div data-testid="message-list">Message List Mock</div>
}))

jest.mock('../error-message', () => ({
  ErrorMessage: () => <div data-testid="error-message">Error Message Mock</div>
}))

jest.mock('../question-input', () => ({
  QuestionInput: () => <div data-testid="question-input">Question Input Mock</div>
}))

// Skip mocking PredictionDisplay for now

describe('PredictionForm', () => {
  // Helper function to render with Redux provider
  const renderWithRedux = (component: React.ReactNode) => {
    return render(
      <Provider store={store}>
        {component}
      </Provider>
    )
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the form with child components', () => {
    renderWithRedux(<PredictionForm />)
    
    expect(screen.getByTestId('star-selector')).toBeInTheDocument()
    expect(screen.getByTestId('message-list')).toBeInTheDocument()
    expect(screen.getByTestId('error-message')).toBeInTheDocument()
    expect(screen.getByTestId('question-input')).toBeInTheDocument()
  })
}) 