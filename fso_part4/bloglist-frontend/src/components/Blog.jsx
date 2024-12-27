import { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog }) => {
  const [visible, setVisible] = useState(false)

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    }
    updateBlog(blog.id, updatedBlog)
  }

  const handleRemove = () => {
    if (
      window.confirm(
        `Are you sure you want to remove "${blog.title}" by ${blog.author}?`
      )
    ) {
      deleteBlog(blog.id)
    }
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div>
          <p>URL: {blog?.url}</p>
          <p>
            Likes: {blog?.likes}
            <button onClick={handleLike}>Like</button>
          </p>
          <p>User: {blog?.user?.name}</p>
          <button
            style={{ color: 'white', backgroundColor: 'red' }}
            onClick={handleRemove}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  )
}

export default Blog
