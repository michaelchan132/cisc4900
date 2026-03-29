import { useEffect, useRef } from "react"
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
  const loadMoreRef = useRef(null)

  useEffect(() => {
    if (!hasMore || loading || loadingMore || searchTerm) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore()
        }
      },
      { threshold: 1 },
    )

    const currentRef = loadMoreRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [hasMore, loading, loadingMore, onLoadMore, searchTerm])

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
      {!searchTerm && hasMore && <div ref={loadMoreRef} style={{ height: "1px" }} />}
    </div>
  )
}

export default RestaurantList
