const express = require('express')
const blogsRouter = express.Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')
/* const User = require('../models/user')
const jwt = require('jsonwebtoken') */

// Route to get all blogs
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  })
  response.json(blogs)
})

// Route to create a new blog
blogsRouter.post('/', middleware.userExtractor, async (req, res) => {
  try {
    const { title, author, url, likes } = req.body
    const user = req.user // Extracted user from middleware

    // Validate required fields
    if (!title || !url) {
      return res.status(400).json({ error: 'Title and URL are required' })
    }

    const blog = new Blog({ title, author, url, likes, user: user.id })
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    res.status(201).json(savedBlog)
  } catch (error) {
    console.error('Error in creating blog:', error.message)
    res.status(500).json({ error: 'Server error' })
  }
})

// Route to delete a blog by ID
blogsRouter.delete('/:id', middleware.userExtractor, async (req, res) => {
  const { id } = req.params
  const user = req.user // Extracted user from middleware

  try {
    const blog = await Blog.findById(id)
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' })
    }

    // Ensure the user deleting is the creator
    if (blog.user.toString() !== user.id.toString()) {
      return res
        .status(403)
        .json({ error: 'Unauthorized: Only the creator can delete this blog' })
    }

    await Blog.findByIdAndDelete(id)
    res.status(204).end()
  } catch (error) {
    console.error('Error in deleting blog:', error.message)
    res.status(400).json({ error: 'Invalid ID or server error' })
  }
})

// Route to update a blog by ID
blogsRouter.put('/:id', async (req, res) => {
  const { id } = req.params
  const { likes } = req.body

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { likes },
      { new: true, runValidators: true, context: 'query' }
    )

    if (!updatedBlog) {
      return res.status(404).json({ error: 'Blog not found' })
    }

    res.json(updatedBlog)
  } catch (error) {
    res.status(400).json({ error: `Invalid ID or data format: ${error}` })
  }
})

module.exports = blogsRouter
