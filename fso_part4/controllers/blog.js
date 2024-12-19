const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  })
  response.json(blogs)
})

blogsRouter.post('/', async (req, res) => {
  try {
    const { title, author, url, likes, userId } = req.body

    const user = await User.findById(userId)

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
    res.status(400).json('An error occurred: ', error)
  }
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
