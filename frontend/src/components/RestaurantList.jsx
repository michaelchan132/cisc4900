import RestaurantCard from "./RestaurantCard"
import SearchBar from "./SearchBar"

function RestaurantList({
  restaurants,
  searchTerm,
  onSearch,
  loading,
  loadingMore,
  hasMore,
  onLoadMore,
}) {

  return (
    <div>
      <h1>Restaurant List</h1>
      <SearchBar value={searchTerm} onSearch={onSearch} />
      {loading && <p>Loading restaurants...</p>}
      {!loading && restaurants.length === 0 && <p>No restaurants found.</p>}
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
      {!searchTerm && loadingMore && <p>Loading more restaurants...</p>}
      {!searchTerm && hasMore && !loadingMore && (
        <button type="button" onClick={onLoadMore}>
          Load more
        </button>
      )}
    </div>
  )
}

export default RestaurantList
