import { createReducer } from '@reduxjs/toolkit'
import { setSelectedStarId, clearSelectedStarId } from './actions'
import { SelectedStarState } from './types'

const initialState: SelectedStarState = {
  selectedStarId: null
}

export const selectedStarReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setSelectedStarId, (state, action) => {
      state.selectedStarId = action.payload
    })
    .addCase(clearSelectedStarId, (state) => {
      state.selectedStarId = null
    })
}) 