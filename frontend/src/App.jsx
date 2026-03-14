import { useEffect, useMemo, useState } from "react"
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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await api.get("/api/restaurants/")
        setRestaurants(response.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurants()
  }, [])

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
            />
          }
        />
        <Route
          path="/restaurants/:id"
          element={<RestaurantDetail restaurants={restaurants} onAddReview={addReview} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
