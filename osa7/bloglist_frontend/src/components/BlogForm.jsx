import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogsReducer'

const BlogForm = () => {
  const dispatch = useDispatch()

  const addBlog = (event) => {
    event.preventDefault()
    const blogObject = {
      title: event.target.title.value,
      author: event.target.author.value,
      url: event.target.url.value,
    }
    dispatch(createBlog(blogObject))
    event.target.title.value = ''
    event.target.author.value = ''
    event.target.url.value = ''
  }

  return (
    <div>
      <form onSubmit={addBlog}>
        <h2>create new blog post</h2>
        <div>
          title
          <input
            data-testid="title"
            name="title"
          />
        </div>
        <div>
          author
          <input
            data-testid="author"
            name="author"
          />
        </div>
        <div>
          url
          <input
            data-testid="url"
            name="url"
          />
        </div>
        <button type="submit">submit</button>
      </form>
    </div>
  )
}


export default BlogForm
