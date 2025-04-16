import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Star {
  id: string
  name: string
  image: string
}

export const stars: Star[] = [
  {
    id: 'michael-jackson',
    name: 'Michael Jackson',
    image: '/images/michael-jackson.jpg'
  },
  {
    id: 'albert-einstein',
    name: 'Albert Einstein',
    image: '/images/albert-einstein.jpg'
  },
  {
    id: 'hulk-hogan',
    name: 'Hulk Hogan',
    image: '/images/hulk-hogan.jpg'
  }
]

interface SelectedStarState {
  selectedStarId: string | null
}

const initialState: SelectedStarState = {
  selectedStarId: null
}

const selectedStarSlice = createSlice({
  name: 'selectedStar',
  initialState,
  reducers: {
    setSelectedStarId: (state, action: PayloadAction<string>) => {
      state.selectedStarId = action.payload === '' ? null : action.payload
    }
  }
})

export const { setSelectedStarId } = selectedStarSlice.actions
export const selectedStarReducer = selectedStarSlice.reducer

// Selectors
export const selectSelectedStarId = (state: { selectedStar: SelectedStarState }) => 
  state.selectedStar.selectedStarId

export const selectSelectedStar = (state: { selectedStar: SelectedStarState }) => 
  stars.find(star => star.id === state.selectedStar.selectedStarId) 