import { useEffect, useMemo, useState, useCallback } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import api from "./api"
import Navbar from "./components/NavBar"
import RestaurantList from "./components/RestaurantList"
import RestaurantDetail from "./components/RestaurantDetail"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  const [restaurants, setRestaurants] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [nextPageUrl, setNextPageUrl] = useState("/api/restaurants/")
  const [hasMore, setHasMore] = useState(true)

  const fetchRestaurants = useCallback(async () => {
    if (!nextPageUrl || loading || loadingMore) {
      return
    }

    const isInitialLoad = restaurants.length === 0
    if (isInitialLoad) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }

    try {
      const response = await api.get(nextPageUrl)
      setRestaurants((current) => [...current, ...(response.data.results || [])])
      setNextPageUrl(response.data.next)
      setHasMore(Boolean(response.data.next))
    } catch (error) {
      console.log(error)
    } finally {
      if (isInitialLoad) {
        setLoading(false)
      } else {
        setLoadingMore(false)
      }
    }
     }, [loading, loadingMore, nextPageUrl, restaurants.length])

  useEffect(() => {

    fetchRestaurants()
  }, [fetchRestaurants])

  const filteredRestaurants = useMemo(() => {
    const query = searchTerm.toLowerCase()
    return restaurants.filter((restaurant) =>
      restaurant.dba.toLowerCase().includes(query),
    )
  }, [restaurants, searchTerm])

  const addReview = (restaurantId, review) => {
    setRestaurants((current) =>
      current.map((restaurant) => {
        if (restaurant.id !== restaurantId) {
          return restaurant
        }

        return {
          ...restaurant,
          reviews: [...(restaurant.reviews || []), review],
        }
      }),
    )
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route
          path="/restaurants"
          element={
            <RestaurantList
              restaurants={filteredRestaurants}
              searchTerm={searchTerm}
              onSearch={setSearchTerm}
              loading={loading}
              loadingMore={loadingMore}
              hasMore={hasMore && !searchTerm}
              onLoadMore={fetchRestaurants}
            />
          }
        />
        <Route
          path="/restaurants/:id"
          element={<RestaurantDetail onAddReview={addReview} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
