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


function createTrieNode() {
  return { children: {}, restaurants: [] }
}

function buildRestaurantTrie(restaurants) {
  const root = createTrieNode()

  restaurants.forEach((restaurant) => {
    const name = restaurant.dba?.toLowerCase() ?? ""
    let node = root
    node.restaurants.push(restaurant)

    for (const char of name) {
      if (!node.children[char]) {
        node.children[char] = createTrieNode()
      }
      node = node.children[char]
      node.restaurants.push(restaurant)
    }
  })

  return root
}

function searchRestaurantsByPrefix(trie, prefix) {
  let node = trie

  for (const char of prefix.toLowerCase()) {
    node = node.children[char]
    if (!node) {
      return []
    }
  }

  return node.restaurants
}


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

  const restaurantTrie = useMemo (
    () => buildRestaurantTrie(restaurants), 
    [restaurants],
  )

  const searchSuggestions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()
    if(!query){
      return []
    }

    return searchRestaurantsByPrefix(restaurantTrie, query).slice(0, 8)
  }, [restaurantTrie, searchTerm])

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
              restaurants={restaurants}
              searchTerm={searchTerm}
              suggestions={searchSuggestions}
              onSearch={setSearchTerm}
              loading={loading}
              loadingMore={loadingMore}
              hasMore={hasMore}
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
