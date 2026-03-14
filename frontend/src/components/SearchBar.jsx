function SearchBar({value, onSearch}) {
    return (
        <div>
        <input 
        placeholder="Search Restaurants"
        value={value}
        onChange={(event) => onSearch(event.target.value)}
        />
    </div>
    )
}

export default SearchBar