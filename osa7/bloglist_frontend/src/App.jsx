import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  BrowserRouter as Router,
  Routes, Route, Link, useParams, useNavigate
} from 'react-router-dom'

import blogService from './services/blogs'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import CommentForm from './components/CommentForm'
import Notification from './components/Notification'

import { setNotification } from './reducers/notificationReducer'
import { likeBlog, mountBlogs, deleteBlog } from './reducers/blogsReducer'
import { setUser, loginUser } from './reducers/userReducer'
import { mountUsers, setUsers } from './reducers/usersReducer'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [comment, setComment] = useState('')
  const user = useSelector(state => {
    return state.user
  })

  const blogs = useSelector(state => {
    return state.blogs
  })

  const users = useSelector(state => {
    return state.users
  })

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(mountBlogs())
    dispatch(mountUsers())
  }, [])

  useEffect(() => {

    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {

      const user = await loginUser(username, password)
      dispatch(setUser(user))
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
    } catch (exception) {
      console.log(exception)
      dispatch(setNotification('wrong username or password', 5))
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    window.localStorage.clear()
    window.location.reload()
  }

  const upvote = (id) => {
    dispatch(likeBlog(id))
  }

  const commentBlog = (id) => {
    const commentObject = {
      content: comment
    }
    blogService
      .comment(id, commentObject)
    setComment('')
  }

  const removeBlog = (id) => {
    const blog = blogs.find((b) => b.id === id)
    if (window.confirm(`Remove blog ${blog.title}?`))
      dispatch(deleteBlog(id))
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <h2>log in to application</h2>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const Blog = ({ blog, likeBlog, removeBlog, user }) => {
    const blogStyle = {
      paddingTop: 10,
      paddingLeft: 2,
      border: 'solid',
      borderWidth: 1,
      marginBottom: 5,
    }
    return (
      <div style={blogStyle}>
        <Link to={`/api/blogs/${blog.id}`}>{blog.title} {blog.author} </Link>
      </div>
    )
  }

  const BlogDisplay = () => {
    return (
      <div>
        <h2>blogs</h2>
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            likeBlog={() => upvote(blog.id)}
            removeBlog={() => removeBlog(blog.id)}
            user={user}
          />
        ))}
      </div>
    )
  }

  const SingleBlogDisplay = ({ blogs }) => {
    const id = useParams().id
    const blog = blogs.find(b => b.id === id)

    if (!blog) {
      return null
    }

    return (
      <div>
        <h3>{blog.title} {blog.author}</h3>
        {blog.url} <br />
        {blog.likes} likes <button onClick={() => upvote(blog.id)}>like</button> <br />
        added by {blog.user.name}
        <CommentForm blogId={id}/>
        <ul>
          {blog.comments.map(c =>
            <li key={c}>
              {c}
            </li>
          )}
        </ul>

      </div>
    )
  }

  const Users = () => {
    const blogsStyle = {
      paddingLeft: 65,
    }

    return (
      <div>
        <h2>Users</h2>
        <h4 style={blogsStyle}>
          blogs created
        </h4>
        {users.map(user =>

          <Link key={user.id} to={`/users/${user.id}`}>{user.name}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{user.blogs.length}
          </Link>
        )}
      </div>
    )
  }

  const UserDisplay = ({ users }) => {
    const id = useParams().id
    const user = users.find(u => u.id === id)

    if (!user) {
      return null
    }

    return (
      <div>
        <h3>{user.name}</h3>
        <h4>added blogs</h4>
        <ul>
          {user.blogs.map(blog =>
            <li key={blog.id}>
              {blog.title}
            </li>
          )}
        </ul>
      </div>
    )
  }

  const BaseApp = () => {
    return (
      <div>
        <Notification />
        {!user && loginForm()}
        {user && (
          <div>
            <Togglable buttonLabel="create new blog post">
              <BlogForm />
            </Togglable>
          </div>
        )}
        {user && BlogDisplay()}
      </div>
    )
  }

  return (
    <Router>
      <div>
        <Link to="/">blogs </Link>
        <Link to="/users">users </Link>
        <p>{user?.name} logged in <button onClick={handleLogout}>log out</button></p>
      </div>

      <Routes>
        <Route path="/" element={<BaseApp />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDisplay users={users} />} />
        <Route path="/api/blogs/:id" element={<SingleBlogDisplay blogs={blogs} />} />
      </Routes>
    </Router>
  )
}

export default App
