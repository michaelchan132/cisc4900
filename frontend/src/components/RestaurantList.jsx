import RestaurantCard from "./RestaurantCard"
import SearchBar from "./SearchBar"

function RestaurantList({
  restaurants,
  searchTerm,
  suggestions,
  onSearch,
  loading,
  error,
  currentPage,
  totalPages,
  hasLoaded,
  onPageChange,
}) {
  const maxVisiblePageButtons = 9
  const halfWindow = Math.floor(maxVisiblePageButtons / 2)
  const maxStartPage = Math.max(1, totalPages - maxVisiblePageButtons + 1)
  const startPage = Math.min(Math.max(1, currentPage - halfWindow), maxStartPage)
  const endPage = Math.min(totalPages, startPage + maxVisiblePageButtons - 1)
  const pageNumbers = Array.from({ length: endPage - startPage + 1}, (_, index) => startPage + index)
  const showLeadingOverflow = startPage > 1
  const showTrailingOverflow = endPage < totalPages

  return (
    <div>
      <h1>Restaurant List</h1>
      <SearchBar value={searchTerm} suggestions={suggestions} onSearch={onSearch} />
      {loading && <p>Loading restaurants...</p>}
      {!loading && error && <p>{error}</p>}
      {!loading && hasLoaded && !error && restaurants.length === 0 && <p>No restaurants found</p>}
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
      {!loading && totalPages > 1 && (
        <nav aria-label="Restaurant list pagination">
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            >
              Previous
            </button>
            {showLeadingOverflow && <span aria-hidden="true">...</span>}
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
          {showTrailingOverflow && <span aria-hidden="true">...</span>}
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            >
              Next
            </button>
        </nav>
      )}
    </div>
  )
}

export default RestaurantList
