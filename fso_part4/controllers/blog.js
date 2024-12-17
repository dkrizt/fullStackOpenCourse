const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

blogsRouter.post('/', async (req, res) => {
  const { title, author, url, likes } = req.body

  // Validate required fields
  if (!title || !url) {
    return res.status(400).json({ error: 'Title and URL are required' })
  }

  const blog = new Blog({ title, author, url, likes })

  const savedBlog = await blog.save()
  res.status(201).json(savedBlog)
})

// Delete a blog by ID
blogsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params

  try {
    const deletedBlog = await Blog.findByIdAndDelete(id)
    if (!deletedBlog) {
      return res.status(404).json({ error: 'Blog not found' })
    }
    res.status(204).end() // No content
  } catch (error) {
    res.status(400).json({ error: `Invalid ID format_${error}` })
  }
})

// Update a blog by ID
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
    res.status(400).json({ error: `Invalid ID or data format_ ${error}` })
  }
})

module.exports = blogsRouter
