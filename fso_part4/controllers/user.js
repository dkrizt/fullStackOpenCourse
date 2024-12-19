const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
  try {
    const { username, name, password } = request.body

    // Validate username and password length
    if (!username || username.length < 3) {
      return response
        .status(400)
        .json({ error: 'Username must be at least 3 characters long' })
    }

    if (!password || password.length < 3) {
      return response
        .status(400)
        .json({ error: 'Password must be at least 3 characters long' })
    }

    // Hash the password
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const newUser = new User({
      username,
      name,
      passwordHash,
    })

    const savedUser = await newUser.save()
    response.status(201).json(savedUser)
  } catch (error) {
    console.error('Caught Error:', error)
    next(error) // Pass the error to the middleware
  }
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', {
    url: 1,
    title: 1,
    author: 1,
    id: 1,
  })
  response.json(users)
})
module.exports = usersRouter
