import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import NewBlogForm from './components/NewBlogForm'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogData, setBlogData] = useState({
    title: '',
    author: '',
    url: '',
    likes: '',
  })
  const [notification, setNotification] = useState(null)

  // Utility to set notifications with a timeout
  const showNotification = (text, type = 'success') => {
    setNotification({ text, type })
    setTimeout(() => setNotification(null), 5000)
  }

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const fetchedBlogs = await blogService.getAll()
        setBlogs(sortBlogs(fetchedBlogs)) // Sort blogs initially
      } catch (error) {
        showNotification('Failed to fetch blogs.', 'error')
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
      blogService.setToken(userCredentials.token)
      setUsername('')
      setPassword('')
      showNotification('Login successful!', 'success')
    } catch (exception) {
      showNotification('Wrong username or password', 'error')
    }
  }

  // Function to sort blogs by likes
  const sortBlogs = (blogs) => {
    return blogs.sort((a, b) => b.likes - a.likes)
  }

  const handleBlogChange = (e) => {
    const { name, value } = e.target
    setBlogData({
      ...blogData,
      [name]: value,
    })
  }

  const handleCreateNewBlog = async (event) => {
    event.preventDefault()

    try {
      const newBlog = await blogService.create(blogData)
      setBlogs((prevBlogs) => sortBlogs([...prevBlogs, newBlog]))
      setBlogData({
        title: '',
        author: '',
        url: '',
        likes: '',
      })
      showNotification(
        `A new blog "${blogData.title}" by ${blogData.author} added`,
        'success'
      )
    } catch (error) {
      console.error('Error creating blog:', error)
      showNotification('Failed to create blog.', 'error')
    }
  }

  const updateBlog = async (id, updatedBlog) => {
    try {
      const returnedBlog = await blogService.update(id, updatedBlog)
      setBlogs(
        sortBlogs(
          blogs.map((blog) =>
            blog.id === id
              ? { ...returnedBlog, user: blog.user } // Merge the user field
              : blog
          )
        )
      )
    } catch (error) {
      console.error('Error updating blog:', error)
    }
  }

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id)
      setBlogs(blogs.filter((blog) => blog.id !== id))
      showNotification('Blog deleted successfully', 'success')
    } catch (error) {
      showNotification(
        error.response?.data?.error || 'Failed to delete the blog',
        'error'
      )
    }
  }

  const handleLogOut = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    showNotification('You have logged out.', 'success')
  }

  return user === null ? (
    <div>
      <h2>Log in to application</h2>
      <Notification message={notification} />
      <LoginForm
        username={username}
        password={password}
        setUsername={setUsername}
        setPassword={setPassword}
        handleLogin={handleLogin}
      />
    </div>
  ) : (
    <div>
      <h2>blogs</h2>
      <Notification message={notification} />
      <p>
        {user.name} is logged-in <button onClick={handleLogOut}>Logout</button>
      </p>
      <div>
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            updateBlog={updateBlog}
            deleteBlog={deleteBlog}
          />
        ))}
      </div>

      <NewBlogForm
        blogData={blogData}
        handleBlogChange={handleBlogChange}
        handleCreateNewBlog={handleCreateNewBlog}
      />
    </div>
  )
}

export default App
