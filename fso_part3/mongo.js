const mongoose = require('mongoose')

// Check the number of arguments passed
if (process.argv.length < 3) {
  console.log('Usage: node mongo.js <password> [<name> <telephone>]')
  process.exit(1)
}

// Extract arguments
const password = process.argv[2]
const name = process.argv[3]
const telephone = process.argv[4]

const url = `mongodb+srv://donkrizt:${password}@cluster0.0vwhk.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

// Define schema and model
const personSchema = new mongoose.Schema({
  name: String,
  telephone: String,
})

const Person = mongoose.model('Person', personSchema)

if (name && telephone) {
  // Save new person to the database
  const person = new Person({
    name,
    telephone,
  })

  person
    .save()
    .then(() => {
      console.log(`added ${name} number ${telephone} to phonebook`)
      mongoose.connection.close()
    })
    .catch((err) => {
      console.error('Error adding person:', err)
      mongoose.connection.close()
    })
} else {
  // Fetch and display all records from the database
  Person.find({})
    .then((persons) => {
      console.log('phonebook:')
      persons.forEach((person) => {
        console.log(`${person.name} ${person.telephone}`)
      })
      mongoose.connection.close()
    })
    .catch((err) => {
      console.error('Error fetching persons:', err)
      mongoose.connection.close()
    })
}
