import RestaurantCard from "./RestaurantCard"
import SearchBar from "./SearchBar"

function RestaurantList({ restaurants, searchTerm, onSearch, loading }) {
  return (
    <div>
      <h1>Restaurant List</h1>
      <SearchBar value={searchTerm} onSearch={onSearch} />
      {loading && <p>Loading restaurants...</p>}
      {!loading && restaurants.length === 0 && <p>No restaurants found.</p>}
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  )
}

export default RestaurantList
