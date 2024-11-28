const Persons = ({ filteredItems }) => {
  return (
    <div>
      {filteredItems.length > 0 ? (
        <div>
          {filteredItems.map((person) => (
            <p key={person.name}>
              {person.name} {person.number}
            </p>
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
