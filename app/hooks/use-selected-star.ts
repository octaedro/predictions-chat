'use client'

import { useDispatch, useSelector } from 'react-redux'
import { selectSelectedStarId, selectSelectedStar } from '../store/selected-star/selectors'
import { setSelectedStarId } from '../store/selected-star/actions'
import { AppDispatch } from '../store'

export function useSelectedStar() {
  const dispatch = useDispatch<AppDispatch>()
  const selectedStarId = useSelector(selectSelectedStarId)
  const selectedStar = useSelector(selectSelectedStar)

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