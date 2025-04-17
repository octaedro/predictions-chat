import { configureStore } from '@reduxjs/toolkit'
import selectedStarReducer from './selected-star/reducer'
import { SelectedStarState } from './selected-star/types'

export const store = configureStore({
  reducer: {
    selectedStar: selectedStarReducer
  }
})

export type RootState = {
  selectedStar: SelectedStarState
}

export type AppDispatch = typeof store.dispatch 