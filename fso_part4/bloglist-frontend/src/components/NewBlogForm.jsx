import React from 'react'

const NewBlogForm = ({ blogData, handleBlogChange, handleCreateNewBlog }) => {
  return (
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
      <button type="submit">Post Blog</button>
    </form>
  )
}

export default NewBlogForm
