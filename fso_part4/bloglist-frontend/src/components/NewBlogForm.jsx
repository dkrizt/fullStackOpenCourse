import React, { useState } from 'react'

const NewBlogForm = ({ blogData, handleBlogChange, handleCreateNewBlog }) => {
  const [addBlogVisible, setAddBlogVisible] = useState(false)

  const hideWhenVisible = { display: addBlogVisible ? 'none' : '' }
  const showWhenVisible = { display: addBlogVisible ? '' : 'none' }
  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={() => setAddBlogVisible(true)}>Add Blog</button>
      </div>
      <div style={showWhenVisible}>
        <form onSubmit={handleCreateNewBlog}>
          <div>
            Title
            <input
              type="text"
              value={blogData.title}
              name="title"
              onChange={handleBlogChange}
            />
          </div>
          <div>
            Author
            <input
              type="text"
              value={blogData.author}
              name="author"
              onChange={handleBlogChange}
            />
          </div>
          <div>
            Url
            <input
              type="text"
              value={blogData.url}
              name="url"
              onChange={handleBlogChange}
            />
          </div>
          <div>
            Likes
            <input
              type="text"
              value={blogData.likes}
              name="likes"
              onChange={handleBlogChange}
            />
          </div>
          <button type="submit" onClick={() => setAddBlogVisible(false)}>
            Post Blog
          </button>
        </form>
        <div>
          <button onClick={() => setAddBlogVisible(false)}>cancel</button>
        </div>
      </div>
    </div>
  )
}

export default NewBlogForm
