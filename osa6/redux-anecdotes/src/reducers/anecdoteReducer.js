import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'
import anecdotes from '../services/anecdotes'

const anecdotesAtStart = []

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}


const initialState = anecdotesAtStart.map(asObject)

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: initialState,
  reducers: {
    newAnecdote(state, action) {
      const content = action.payload
      state.push(content)
    },
    upvote(state, action) {
      const id = action.payload
      const anecdoteToChange = state.find(a => a.id === id)
      const changedAnecdote = {
        ...anecdoteToChange,
        votes: anecdoteToChange.votes + 1
      }
      return state.map(a =>
        a.id !== id ? a : changedAnecdote
      ).sort((a, b) => (a.votes < b.votes) ? 1 : (a.votes > b.votes ? -1 : 0))
    },
    setAnecdotes(state, action) {
      return action.payload
    }
  }
})

export const { newAnecdote, upvote, setAnecdotes } = anecdoteSlice.actions

export const createAnecdote = content => {
  return async dispatch => {
    const anecdote = await anecdoteService.createNew(content)
    dispatch(newAnecdote(anecdote))
  }
}

export const likeAnecdote = id => {
  const likedAnecdote = anecdotes.find(a => a.id === id)
  return async dispatch => {
    const anecdote = await anecdoteService.update(id, likedAnecdote)
    dispatch(upvote(anecdote))
  }
}
export default anecdoteSlice.reducer