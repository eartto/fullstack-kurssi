import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const initialState = []

const blogSlice = createSlice({
  name: 'blogs',
  initialState: initialState,
  reducers: {
    newBlog(state, action) {
      const content = action.payload
      state.push(content)
    },
    upvote(state, action) {
      const blog = action.payload
      const blogToChange = state.find((b) => b.id === blog.id)
      const changedBlog = {
        ...blogToChange,
        likes: blogToChange.likes + 1,
      }
      return state
        .map((b) => (b.id !== blog.id ? b : changedBlog))
        .sort((a, b) => (a.likes < b.likes ? 1 : a.likes > b.likes ? -1 : 0))
    },
    removeBlog(state, action) {
      const id = action.payload
      const blogToBeRemoved = state.find((b) => b.id === id)
      return state.filter((b) => b !== blogToBeRemoved)
    },
    setBlogs(state, action) {
      return action.payload
    },
  },
})

export const { newBlog, upvote, removeBlog, setBlogs } = blogSlice.actions

export const createBlog = (content) => {
  return async (dispatch) => {
    const blog = await blogService.create(content)
    dispatch(newBlog(blog))
  }
}

export const likeBlog = (id) => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    const likedBlog = blogs.find((b) => b.id === id)
    const changedBlog = { ...likedBlog, likes: likedBlog.likes + 1 }
    const blog = await blogService.update(id, changedBlog)
    dispatch(upvote(blog))
  }
}

export const commentBlog = (blogId, commentObject) => {
  return async () => {
    await blogService.comment(blogId.blogId, commentObject)
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    const blogToBeDeleted = blogs.find((b) => b.id === id)
    await blogService.remove(blogToBeDeleted.id)
    dispatch(removeBlog(id))
  }
}

export const mountBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    blogs.sort((a, b) => (a.likes < b.likes ? 1 : a.likes > b.likes ? -1 : 0))
    dispatch(setBlogs(blogs))
  }
}

export default blogSlice.reducer
