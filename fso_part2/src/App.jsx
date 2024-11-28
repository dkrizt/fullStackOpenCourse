import { useState } from "react";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";
import Persons from "./components/Persons";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newNumber, setNewNumber] = useState("");
  const [newName, setNewName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSetNewName = (event) => {
    const displayName = event.target.value;
    setNewName(displayName);
  };

  const handleSetNewNumber = (event) => {
    const displayNumber = event.target.value;
    setNewNumber(displayNumber);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nameObj = { name: newName, number: newNumber };

    //check if name object already exists before adding to array
    const isConflict = persons.some(
      (person) => person.name.toLowerCase() === nameObj.name.toLowerCase()
    );

    if (isConflict) {
      alert(`Conflict detected: ${nameObj.name} is already added to phonebook`);
    } else {
      setPersons(persons.concat(nameObj));
      setNewName("");
      setNewNumber("");
    }
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchQuery(searchTerm);
  };

  const filteredItems = persons.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter searchQuery={searchQuery} handleSearch={handleSearch}/>

      <h2>Add a new Phone Directory</h2>

      <PersonForm
        handleSubmit={handleSubmit}
        newName={newName}
        newNumber={newNumber}
        handleSetNewName={handleSetNewName}
        handleSetNewNumber={handleSetNewNumber}
      />

      <h2>Numbers</h2>

      <Persons filteredItems={filteredItems}/>

    </div>
  );
};

export default App;
