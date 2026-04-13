import RestaurantCard from "./RestaurantCard"
import SearchBar from "./SearchBar"

function RestaurantList({
  restaurants,
  searchTerm,
  suggestions,
  onSearch,
  loading,
  currentPage,
  totalPages,
  onPageChange,
}) {
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <div>
      <h1>Restaurant List</h1>
      <SearchBar value={searchTerm} suggestions={suggestions} onSearch={onSearch} />
      {loading && <p>Loading restaurants...</p>}
      {!loading && restaurants.length === 0 && <p>No restaurants found.</p>}
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
      {!loading && totalPages > 1 && (
        <nav aria-label="Restaurant list pagniation">
          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => onPageChange(pageNumber)}
              disabled={currentPage === pageNumber}
              aria-current={currentPage === pageNumber ? "page" : undefined}
              >
                  {pageNumber}
              </button>
          ))}
        </nav>
      )}
    </div>
  )
}

export default RestaurantList
