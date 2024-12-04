const express = require("express");
const morgan = require("morgan");
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 3001;




const phonebook = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(cors())
app.use(express.json());

// Define a custom token to log request body
morgan.token("body", (req) => JSON.stringify(req.body));

// Use morgan with 'tiny' format and the custom token
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/persons", (req, res) => {
  res.send(phonebook);
});

app.post("/api/persons", (req, res) => {
    const { name, number } = req.body;
  
    // Check if name or number is missing
    if (!name || !number) {
      return res.status(400).json({ error: "Name or number is missing" });
    }
  
    // Check for duplicate names
    const existingPerson = phonebook.find(person => person.name.toLowerCase() === name.toLowerCase());
    if (existingPerson) {
      return res.status(400).json({ error: "Name must be unique" });
    }
  
    // Add the new person
    const newPerson = {
      id: String(Math.floor(Math.random() * 1000000)), // Generate a random ID
      name,
      number,
    };
    phonebook.push(newPerson);
  
    // Respond with the new person and a 201 Created status
    return res.status(201).json(newPerson);
  });
  

app.get("/info", (req, res) => {
  const totalPersons = phonebook.length;
  const currentTime = new Date();

  res.send(
    `<div>
      <p>phonebook has info for ${totalPersons} people</p>
      <p>${currentTime}</p>
    </div>`
  );
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = phonebook.find((person) => person.id === id);

  if (!person) {
    return res
      .status("404")
      .send("person not available in phonebook, please try again!");
  }

  return res.send(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = phonebook.filter((person) => person.id !== id);

  /*     if(!person){
        return res.status(404).send("person not available in phonebook, please try again!")
    } */

  return res.status(204).send(`successfully deleted ${person}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
