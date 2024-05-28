import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: null,
    reducers: {
        showNotification(state, action) {
            const notification = action.payload
            state = notification
            return state
        },
        hideNotification(state) {
            state = null
            return state
        }
    }
})

export const { showNotification, hideNotification } = notificationSlice.actions

export const setNotification = (notification, seconds) => {
    return async dispatch => {
        dispatch(showNotification(notification))
        setTimeout(() => {
            dispatch(hideNotification())
        }, seconds * 1000)
    }
}

export default notificationSlice.reducer