import { Link } from "react-router-dom"

function SearchBar({
    value, 
    suggestions = [], 
    onSearch,
    borough,
    inspection,
    onBoroughChange,
    onInspectionChange,
    sortBy,
    onSortByChange,
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
        <select value={sortBy} onChange={(event) => onSortByChange(event.target.value)}>
            <option value="id_asc">Sort: ID (Ascending)</option>
            <option value="id_desc">Sort: ID (Descending)</option>
            <option value="name_asc">Sort: Name (A-Z)</option>
            <option value="name_desc">Sort: Name (Z-A)</option>
            <option value="boro_asc">Sort: Borough (A-Z)</option>
            <option value="boro_desc">Sort: Borough (Z-A)</option>
        </select>
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