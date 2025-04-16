'use client'

import { useSelectedStar } from '../hooks/use-selected-star'
import { useEffect } from 'react'

// Color mapping for stars
const starBackgroundColors = {
  michael: '#e0c6ff', // Pastel purple for Michael
  einstein: '#c6e0ff', // Pastel blue for Einstein
  hulk: '#c6ffd7', // Pastel green for Hulk
  default: '#ffefd5' // Pastel peach (default)
}

export function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  const { selectedStarId } = useSelectedStar()

  useEffect(() => {
    // Find the main element
    const mainElement = document.querySelector('main')
    if (!mainElement) return
    
    // Set background color directly on the element
    if (selectedStarId && selectedStarId in starBackgroundColors) {
      mainElement.style.background = starBackgroundColors[selectedStarId as keyof typeof starBackgroundColors]
    } else {
      mainElement.style.background = starBackgroundColors.default
    }
    
    // Add transition for smooth color changes
    mainElement.style.transition = 'background-color 0.5s ease'
    
    return () => {
      // Reset when component unmounts
      if (mainElement) {
        mainElement.style.background = ''
      }
    }
  }, [selectedStarId])

  return <>{children}</>
} 