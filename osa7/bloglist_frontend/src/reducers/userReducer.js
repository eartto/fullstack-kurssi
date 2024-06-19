import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'

const initialState = null

const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {
    setUser(state, action) {
      return action.payload
    },
  },
})

export const { setUser } = userSlice.actions

export const loginUser = async (username, password) => {
  const login = await loginService.login({ username, password })
  return login
}

export default userSlice.reducer
