import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogData, setBlogData] = useState({
    title: '',
    author: '',
    url: '',
    likes: '',
  })

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogs = await blogService.getAll()
        setBlogs(blogs)
      } catch (error) {
        console.error('Failed to fetch blogs:', error)
      }
    }

    fetchBlogs()
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
      const userCredentials = await loginService.login({
        username,
        password,
      })
      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(userCredentials)
      )
      setUser(userCredentials)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleBlogChange = (e) => {
    const { name, value } = e.target
    setBlogData({
      ...blogData,
      [name]: value, // Dynamically update the field
    })
  }

  const handleCreateNewBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog = await blogService.create(blogData)
      setBlogs((prevBlogs) => [...prevBlogs, newBlog])
      setBlogData({
        title: '',
        author: '',
        url: '',
        likes: '',
      })
    } catch (error) {
      console.error('Failed to create blogs:', error)
    }
  }

  // Logout handler
  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogappUser') // Clear localStorage
    setUser(null) // Reset user state to null
  }

  return user === null ? (
    <div>
      <h2>Log in to application</h2>
      <LoginForm
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        handleLogin={handleLogin}
      />
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  ) : (
    <div>
      <h2>blogs</h2>
      <p>
        {user.name} is logged-in <button onClick={handleLogOut}>Logout</button>
      </p>

      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
      <NewBlogForm
        blogData={blogData}
        handleBlogChange={handleBlogChange}
        handleCreateNewBlog={handleCreateNewBlog}
      />
    </div>
  )
}

export default App
