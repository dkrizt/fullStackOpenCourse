// eslint-disable-next-line no-unused-vars
const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const favorite = blogs.reduce(
    (max, blog) => (blog.likes > max.likes ? blog : max),
    blogs[0]
  )

  return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes,
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  // Count blogs by each author
  const authorCount = blogs.reduce((count, blog) => {
    count[blog.author] = (count[blog.author] || 0) + 1
    return count
  }, {})

  // Find the author with the most blogs
  const topAuthor = Object.entries(authorCount).reduce(
    (max, [author, blogs]) => {
      return blogs > max.blogs ? { author, blogs } : max
    },
    { author: '', blogs: 0 }
  )

  return topAuthor
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  // Aggregate likes by author
  const likesCount = blogs.reduce((count, blog) => {
    count[blog.author] = (count[blog.author] || 0) + blog.likes
    return count
  }, {})

  // Find the author with the most likes
  const topAuthor = Object.entries(likesCount).reduce(
    (max, [author, likes]) => {
      return likes > max.likes ? { author, likes } : max
    },
    { author: '', likes: 0 }
  )

  return topAuthor
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
