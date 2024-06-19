import { useState } from 'react'

const Blog = ({ blog, likeBlog, removeBlog, user }) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const [viewFullBlog, setViewFullBlog] = useState(false)
  const isUser = blog.user.username === user.username ? true : false

  const toggleView = () => {
    setViewFullBlog(!viewFullBlog)
  }

  const LimitedView = () => {
    return (
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={() => toggleView()}> view </button>
      </div>
    )
  }

  const FullView = () => {
    return (
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={() => toggleView()}> hide </button>
        <div>{blog.url}</div>
        likes: {blog.likes} <button onClick={() => likeBlog()}> like </button>
        <div>{blog.user.name}</div>
      </div>
    )
  }

  const UserFullView = () => {
    return (
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={() => toggleView()}> hide </button>
        <div>{blog.url}</div>
        likes: {blog.likes} <button onClick={() => likeBlog()}> like </button>{' '}
        <div>{blog.user.name}</div>
        <button onClick={() => removeBlog()}> remove </button>
      </div>
    )
  }

  return (
    <div className="blog" style={blogStyle}>
      {!viewFullBlog && LimitedView()}
      {viewFullBlog && !isUser && FullView()}
      {viewFullBlog && isUser && UserFullView()}
    </div>
  )
}

export default Blog
