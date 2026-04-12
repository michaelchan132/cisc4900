function SearchBar({value, suggestions, onSearch}) {
    return (
    <div>
        <input 
        placeholder="Search Restaurants"
        value={value}
        onChange={(event) => onSearch(event.target.value)}
        />
        {value.trim() && suggestions.length > 0 && (
            <ul>
                {suggestions.map((restaurant) => (
                    <li key={restaurant.id}>{restaurant.dba}</li>
                ))}
            </ul>
        )}
        {value.trim() && suggestions.length === 0 && <p>No matching restaurants</p>}
    </div>
    )
}

export default SearchBar