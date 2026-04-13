import { Link } from "react-router-dom"

function SearchBar({value, suggestions = [], onSearch}) {
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
                    <li key={restaurant.id}>
                        <Link to={`/restaurants/${restaurant.id}`}>{restaurant.dba}</Link>
                    </li>
                ))}
            </ul>
        )}
        {value.trim() && suggestions.length === 0 && <p>No matching restaurants</p>}
    </div>
    )
}

export default SearchBar