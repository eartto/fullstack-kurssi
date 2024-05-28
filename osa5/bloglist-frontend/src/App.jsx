import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((a, b) => (a.likes < b.likes) ? 1 : (a.likes > b.likes ? -1 : 0)))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotification('wrong username or password')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    window.localStorage.clear()
    window.location.reload()
  }

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        returnedBlog.user = user
        setBlogs(blogs.concat(returnedBlog))
      })
    setNotification(`a new blog ${blogObject.title} added`)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const likeBlog = id => {
    const blog = blogs.find(b => b.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }

    blogService
      .update(id, changedBlog)
      .then(
        setBlogs(blogs.map(blog => blog.id !== id ? blog : changedBlog))
      )
  }

  const removeBlog = id => {
    const blog = blogs.find(b => b.id === id)
    if (window.confirm(`Remove blog ${blog.title}?`))

      blogService
        .remove(id)
        .then(
          setBlogs(blogs.filter(blog => blog.id !== id))
        )
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

  const BlogDisplay = () => {

    return (
      <div>
        <h2>blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog}
            likeBlog={() => likeBlog(blog.id)}
            removeBlog={() => removeBlog(blog.id)}
            user={user}
          />
        )}
      </div>
    )
  }

  const Notification = () => {
    return (
      <div>
        {notification}
      </div>
    )
  }

  return (
    <div>
      <Notification />
      {!user && loginForm()}
      {user && <div>
        <p>{user.name} logged in</p>
        <button onClick={handleLogout}>log out</button>
        <Togglable buttonLabel='create new blog post'>
          <BlogForm
            createBlog={addBlog}
          />
        </Togglable>
      </div>
      }
      {user && BlogDisplay()}
    </div>
  )
}

export default App