import { createSelector } from '@reduxjs/toolkit'
import { RootState } from '../index'
import { STARS } from '../../constants/stars'

// Base selector - gets the selectedStarId from state
export const selectSelectedStarId = (state: RootState) => state.selectedStar.selectedStarId

// Memoized selector - finds the star object based on the selected ID
export const selectSelectedStar = createSelector(
  [selectSelectedStarId],
  (selectedStarId) => selectedStarId ? STARS.find(star => star.id === selectedStarId) : null
) 