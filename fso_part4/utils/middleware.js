const jwt = require('jsonwebtoken')
const User = require('../models/user')
const logger = require('./logger')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  } else {
    request.token = null
  }
  next()
}

// Middleware to extract user information from token
const userExtractor = async (req, res, next) => {
  try {
    const token = req.token // Assume tokenExtractor has already set req.token
    if (!token) {
      return res.status(401).json({ error: 'Token missing or invalid' })
    }

    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!decodedToken.id) {
      return res.status(401).json({ error: 'Token invalid' })
    }

    const user = await User.findById(decodedToken.id)
    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }

    req.user = user // Attach the user to the request object
    next()
  } catch (error) {
    console.error('Error in userExtractor:', error.message)
    return res.status(401).json({ error: 'Authentication failed' })
  }
}

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  // Log the error details for better debugging
  logger.error('Error Name:', error.name)
  logger.error('Error Message:', error.message)
  logger.error('Full Error:', error)

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'malformatted id' })
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  if (error.name === 'MongoServerError' && error.code === 11000) {
    return response
      .status(400)
      .json({ error: 'expected `username` to be unique' })
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' })
  }

  // Catch-all error response
  response.status(500).json({ error: 'something went wrong' })

  next(error)
}

module.exports = {
  tokenExtractor,
  userExtractor,
  requestLogger,
  unknownEndpoint,
  errorHandler,
}
