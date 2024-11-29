import { useState, useEffect } from "react";
import PersonForm from "./components/PersonForm";
import Filter from "./components/Filter";
import Persons from "./components/Persons";
import phonebookService from "./services/phonebook";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newNumber, setNewNumber] = useState("");
  const [newName, setNewName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    phonebookService
      .getAll()
      .then((initialPersons) => setPersons(initialPersons));
  }, []);

  const handleSetNewName = (event) => {
    const displayName = event.target.value;
    setNewName(displayName);
  };

  const handleSetNewNumber = (event) => {
    const displayNumber = event.target.value;
    setNewNumber(displayNumber);
  };

 //Create or update a phonebook log on submission
 const handleSubmit = (event) => {
  event.preventDefault();
  const nameObj = { name: newName, number: newNumber };

  // Check if the person already exists in the phonebook
  const existingPerson = persons.find(
    (person) => person.name.toLowerCase() === nameObj.name.toLowerCase()
  );

  if (existingPerson) {
    // Ask for confirmation before updating the number
    const confirmUpdate = window.confirm(
      `${existingPerson.name} is already in the phonebook. Replace the old number with the new one?`
    );

    if (confirmUpdate) {
      // Update the person's phone number using HTTP PUT
      phonebookService
        .update(existingPerson.id, nameObj) // PUT request
        .then((updatedPerson) => {
          // Update state with the new data
          setPersons((prevPersons) =>
            prevPersons.map((person) =>
              person.id === updatedPerson.id ? updatedPerson : person
            )
          );
          setNewName("");
          setNewNumber("");
        })
        .catch((error) => {
          console.error("Error updating person:", error);
          alert(
            `Failed to update ${existingPerson.name}. They might have been removed from the server.`
          );
        });
    }
  } else {
    // Add a new person if they don't already exist
    phonebookService.create(nameObj).then((returnedPerson) => {
      setPersons(persons.concat(returnedPerson));
      setNewName("");
      setNewNumber("");
    });
  }
};


  //Search through phonebook by name
  const handleSearch = (event) => {
    const searchTerm = event.target.value;
    setSearchQuery(searchTerm);
  };

  const filteredItems = persons.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  //Delete a phonebook log
  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this contact?");
    
    if (confirmDelete) {
      phonebookService
        .remove(id)
        .then(() => {
          setPersons((prevPersons) => prevPersons.filter((person) => person.id !== id));
        })
        .catch((error) => {
          console.error("Error in handleDelete:", error);
          alert("Failed to delete the contact. It might have been removed already.");
        });
    }
  };
  
  
  

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter searchQuery={searchQuery} handleSearch={handleSearch} />

      <h2>Add a new Phone Directory</h2>

      <PersonForm
        handleSubmit={handleSubmit}
        newName={newName}
        newNumber={newNumber}
        handleSetNewName={handleSetNewName}
        handleSetNewNumber={handleSetNewNumber}
      />

      <h2>Numbers</h2>

      <Persons filteredItems={filteredItems} handleDelete={handleDelete}/>
    </div>
  );
};

export default App;
