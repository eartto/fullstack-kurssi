import { createSlice } from '@reduxjs/toolkit'

const filterSlice = createSlice({
  name: 'filter',
  initialState: '',
  reducers: {
    setFilter(state, action) {
      const filter = action.payload
      state = filter
      return state

    }
  }
})

export const { setFilter } = filterSlice.actions
export default filterSlice.reducer