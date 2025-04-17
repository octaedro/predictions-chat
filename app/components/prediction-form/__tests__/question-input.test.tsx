import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { QuestionInput } from '../question-input'

describe('QuestionInput', () => {
  const defaultProps = {
    question: '',
    onChange: jest.fn(),
    onSubmit: jest.fn(),
    isLoading: false,
    selectedStarId: null
  }

  it('renders correctly when no star is selected', () => {
    render(<QuestionInput {...defaultProps} />)
    
    const input = screen.getByPlaceholderText(/select a star first/i)
    expect(input).toBeDisabled()
    
    const button = screen.getByRole('button', { name: /predict/i })
    expect(button).toBeDisabled()
  })

  it('renders correctly when a star is selected', () => {
    render(
      <QuestionInput 
        {...defaultProps} 
        selectedStarId="star-1"
      />
    )
    
    const input = screen.getByPlaceholderText(/ask your question/i)
    expect(input).not.toBeDisabled()
    
    const button = screen.getByRole('button', { name: /predict/i })
    expect(button).toBeDisabled() // Button still disabled because no question text
  })

  it('enables button when star selected and question provided', () => {
    render(
      <QuestionInput 
        {...defaultProps} 
        selectedStarId="star-1"
        question="Test question"
      />
    )
    
    const button = screen.getByRole('button', { name: /predict/i })
    expect(button).not.toBeDisabled()
  })

  it('calls onChange when input changes', () => {
    render(
      <QuestionInput 
        {...defaultProps} 
        selectedStarId="star-1"
      />
    )
    
    const input = screen.getByPlaceholderText(/ask your question/i)
    fireEvent.change(input, { target: { value: 'New question' } })
    
    expect(defaultProps.onChange).toHaveBeenCalled()
  })

  it('calls onSubmit when form is submitted', () => {
    render(
      <QuestionInput 
        {...defaultProps} 
        selectedStarId="star-1"
        question="Test question"
      />
    )
    
    // Since we don't have role="form" on the form, we'll get it by its function
    const form = screen.getByRole('form')
    fireEvent.submit(form)
    
    expect(defaultProps.onSubmit).toHaveBeenCalled()
  })

  it('shows loading state when isLoading is true', () => {
    render(
      <QuestionInput 
        {...defaultProps} 
        selectedStarId="star-1"
        question="Test question"
        isLoading={true}
      />
    )
    
    const button = screen.getByRole('button', { name: /predicting/i })
    expect(button).toBeDisabled()
    
    const input = screen.getByPlaceholderText(/ask your question/i)
    expect(input).toBeDisabled()
  })
}) 