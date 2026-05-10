import { Link } from "react-router-dom"

function SearchBar({
    value, 
    suggestions = [], 
    onSearch,
    borough,
    inspection,
    onBoroughChange,
    onInspectionChange,
}) {
    return (
    <div>
        <input 
        placeholder="Search Restaurants"
        value={value}
        onChange={(event) => onSearch(event.target.value)}
        />
        <select value={borough} onChange={(event) => onBoroughChange(event.target.value)}>
            <option value="">All Boroughs</option>
            <option value="Manhattan">Manhattan</option>
            <option value="Brooklyn">Brooklyn</option>
            <option value="Queens">Queens</option>
            <option value="Bronx">Bronx</option>
            <option value="Staten Island">Staten Island</option>
        </select>
        <input
            placeholder="Inspection Grade (e.g. A)"
            value={inspection}
            onChange={(event) => onInspectionChange(event.target.value)}
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