'use client'

import { useDispatch, useSelector } from 'react-redux'
import { selectSelectedStarId } from '../store/selected-star'
import { setSelectedStarId, clearSelectedStarId } from '../store/selected-star/actions'
import { AppDispatch } from '../store'
import { stars } from '../components/constants'

export function useSelectedStar() {
  const dispatch = useDispatch<AppDispatch>()
  const selectedStarId = useSelector(selectSelectedStarId)
  const selectedStar = selectedStarId 
    ? stars.find(star => star.id === selectedStarId) 
    : null

  const handleSelectStar = (starId: string) => {
    dispatch(setSelectedStarId(starId))
  }

  const handleClearStar = () => {
    dispatch(clearSelectedStarId())
  }

  return {
    selectedStar,
    selectedStarId,
    isStarSelected: selectedStarId !== null,
    handleSelectStar,
    handleClearStar
  }
} 