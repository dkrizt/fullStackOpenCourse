const express = require('express')
const morgan = require('morgan')
require('dotenv').config()

const Person = require('./models/person')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

// Define a custom token to log request body
morgan.token('body', (req) => JSON.stringify(req.body))

// Use morgan with 'tiny' format and the custom token
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

//Request logger replace by morgan tiny
/* const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};
app.use(requestLogger); */

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

//Get all persons in the phonebook
app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons)
  })
})

//Create a new person and added to the phonebook
app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  // Check if name or number is missing in formdata
  if (!name || !number) {
    return res.status(400).json({ error: 'Name or number is missing' })
  }
  const person = new Person({
    name,
    number,
  })
  person
    .save()
    .then((savedPerson) => {
      // Respond with the new person and a 201 Created status
      return res.status(201).json(savedPerson)
    })
    .catch((error) => next(error))
})

//Get and display data about the phonebook
app.get('/info', (req, res) => {
  const totalPersons = Person.length
  const currentTime = new Date()

  res.send(
    `<div>
      <p>phonebook has info for ${totalPersons} people</p>
      <p>${currentTime}</p>
    </div>`
  )
})

//Get the data of a single person in the phonebook by Id
app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id

  Person.findById(id)
    .then((person) => {
      if (!person) {
        return res.status(404).send({ error: 'Person not found in phonebook' })
      }
      res.json(person)
    })
    .catch((error) => next(error))
})

//Update a person details that already exists
app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then((updatedPerson) => {
      res.json(updatedPerson)
    })
    .catch((error) => next(error))
})

//Delete a single person from the phonebook by id
app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id

  Person.findByIdAndDelete(id)
    .then((result) => {
      if (!result) {
        return res.status(404).send({ error: 'Person not found' })
      }
      res.status(204).end() // Successfully deleted
    })
    .catch((error) => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
