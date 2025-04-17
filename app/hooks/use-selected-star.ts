'use client'

import { useDispatch, useSelector } from 'react-redux'
import { selectSelectedStarId } from '../store/selected-star'
import { setSelectedStarId } from '../store/selected-star/actions'
import { AppDispatch } from '../store'
import { STARS } from '../components/constants'

export function useSelectedStar() {
  const dispatch = useDispatch<AppDispatch>()
  const selectedStarId = useSelector(selectSelectedStarId)
  const selectedStar = selectedStarId 
    ? STARS.find(star => star.id === selectedStarId) 
    : null

  function handleSelectStar(starId: string) {
    dispatch(setSelectedStarId(starId))
  }

  function handleClearStar() {
    dispatch(setSelectedStarId(''))
  }

  return {
    selectedStar,
    selectedStarId,
    isStarSelected: selectedStarId !== null && selectedStarId !== '',
    handleSelectStar,
    handleClearStar
  }
} 