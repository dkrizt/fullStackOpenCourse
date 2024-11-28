
const Filter = ({searchQuery, handleSearch}) => {
  return (
    <div>
    Search Name: <input value={searchQuery} onChange={handleSearch} />
  </div>
  )
}

export default Filter
