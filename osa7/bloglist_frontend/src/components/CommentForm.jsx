import { useDispatch } from 'react-redux'
import { commentBlog } from '../reducers/blogsReducer'

const CommentForm = (blogId) => {
  const dispatch = useDispatch()

  const addComment = (event) => {
    event.preventDefault()
    const commentObject = {
      content: event.target.comment.value
    }
    dispatch(commentBlog(blogId ,commentObject))
    event.target.comment.value = ''
  }

  return (
    <div>
      <h3>comments</h3>
      <form onSubmit={addComment}>
        <input
          name='comment'
        />
        <button type="submit">add comment</button>
      </form>
    </div>
  )
}

export default CommentForm