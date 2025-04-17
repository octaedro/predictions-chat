'use client'

import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface QuestionInputProps {
  question: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent) => void
  isLoading: boolean
  selectedStarId: string | null
}

export function QuestionInput({ 
  question, 
  onChange, 
  onSubmit, 
  isLoading, 
  selectedStarId
}: QuestionInputProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-2 mt-6">
      <Input
        type="text"
        placeholder={selectedStarId ? "Ask your question..." : "Select a star first..."}
        value={question}
        onChange={onChange}
        disabled={isLoading || !selectedStarId}
        className={`w-full h-12 rounded-xl border-zinc-300 transition-all duration-200 
          ${!selectedStarId 
            ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' 
            : 'bg-white text-black focus:border-purple-500 focus:ring-purple-500/20'} 
          placeholder:text-zinc-500`}
      />
      <Button
        type="submit"
        disabled={isLoading || !question.trim() || !selectedStarId}
        className="w-full sm:w-auto h-12 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 transition-colors"
      >
        {isLoading ? 'Predicting...' : 'Predict'}
      </Button>
    </form>
  )
} 