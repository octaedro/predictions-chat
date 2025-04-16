import { createAction } from '@reduxjs/toolkit'
import { Star } from './types'

export const setSelectedStarId = createAction<string>('selectedStar/setSelectedStarId')
export const clearSelectedStarId = createAction('selectedStar/clearSelectedStarId') 