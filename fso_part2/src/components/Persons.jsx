const Persons = ({ filteredItems, handleDelete }) => {
  return (
    <div>
      {filteredItems.length > 0 ? (
        <div>
          {filteredItems.map((person) => (
            <div key={person.id}>
              <p>
                {person.name} {person.number}{" "}
                <button onClick={() => handleDelete(person.id)}>Delete</button>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p>No Match found</p>
        </div>
      )}
    </div>
  );
};

export default Persons;
