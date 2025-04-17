import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SelectedStarState } from './types'

const initialState: SelectedStarState = {
  selectedStarId: null
}

const selectedStarSlice = createSlice({
  name: 'selectedStar',
  initialState,
  reducers: {
    setSelectedStarId: (state, action: PayloadAction<string>) => {
      // Set to null if empty string is provided (used for clearing)
      state.selectedStarId = action.payload === '' ? null : action.payload
    }
  }
})

// Export the reducer as default
export default selectedStarSlice.reducer

// Export the slice for internal use (actions.ts will use this)
export { selectedStarSlice } 