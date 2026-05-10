import { useEffect, useMemo, useState, useCallback } from "react"
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import api from "./api"
import RestaurantList from "./components/RestaurantList"
import RestaurantDetail from "./components/RestaurantDetail"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import NotFound from "./pages/NotFound"
import ProtectedRoute from "./components/ProtectedRoute"
import NavBar from "./components/NavBar"

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

function PageLayout ({ children }) {
  return (
    <div className="page-shell">
      <NavBar />
      {children}
    </div>
  )
}

function App() {
  const [restaurants, setRestaurants] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [fetchError, setFetchError] = useState("")
  const [hasLoaded, setHasLoaded] = useState(false)
  const [boroughFilter, setBoroughFilter] = useState("")
  const [inspectionFilter, setInspectionFilter] = useState("")
  const [sortBy, setSortBy] = useState("id_asc")


  const fetchRestaurants = useCallback(async (page = 1, borough = boroughFilter, inspection = inspectionFilter, sort = sortBy) => {

    setLoading(true)
    setFetchError("")

    try {
      const response = await api.get("/api/restaurants/", {
        params: { 
          page,
          ...(borough ? { boro: borough} : {}),
          ...(inspection ? { inspection } : {}),
          ...(sort ? { sort } : {}),
        },
      })
      const isPaginatedResponse = 
      response.data && typeof response.data === "object" && Array.isArray(response.data.results)

      if (isPaginatedResponse) {
        const restaurantResults = response.data.results
        const restaurantCount = response.data.count || 0
        const pageSize = 20

        setRestaurants(restaurantResults)
        setCurrentPage(page)
        setTotalPages(Math.max(1, Math.ceil(restaurantCount / pageSize)))
        return
      }
      const listResults = Array.isArray(response.data) ? response.data : []
      setRestaurants(listResults)
      setCurrentPage(1)
      setTotalPages(1)
    } catch (error) {
      console.log(error)
      setRestaurants([])
      setTotalPages(1)
      setFetchError("Unable to load restaurants right now. Please try again.")
    } finally {
      setLoading(false)
      setHasLoaded(true)
    }
     }, [boroughFilter, inspectionFilter, sortBy])

  useEffect(() => {

    fetchRestaurants(1)
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
  
  const handleBoroughChange = (boro) => {
    setBoroughFilter(boro)
    fetchRestaurants(1, boro, inspectionFilter, sortBy)
  }

  const handleInspectionChange = (inspection) => {
    setInspectionFilter(inspection)
    fetchRestaurants(1, boroughFilter, inspection, sortBy)
  }

  const handleSortByChange = (sort) => {
    setSortBy(sort)
    fetchRestaurants(1, boroughFilter, inspectionFilter, sort)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PageLayout><ProtectedRoute><Home /></ProtectedRoute></PageLayout>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route
          path="/profile"
          element={
            <PageLayout><ProtectedRoute><Profile /></ProtectedRoute></PageLayout>
          }
          />
        <Route
          path="/restaurants"
          element={
            <PageLayout><RestaurantList
              restaurants={restaurants}
              searchTerm={searchTerm}
              suggestions={searchSuggestions}
              onSearch={setSearchTerm}
              loading={loading}
              error={fetchError}
              currentPage={currentPage}
              totalPages={totalPages}
              hasLoaded={hasLoaded}
              onPageChange={fetchRestaurants}
              borough={boroughFilter}
              inspection={inspectionFilter}
              onBoroughChange={handleBoroughChange}
              onInspectionChange={handleInspectionChange}
              sortBy={sortBy}
              onSortByChange={handleSortByChange}
            />
            </PageLayout>
          }
        />
        <Route
          path="/restaurants/:id"
          element={<PageLayout><RestaurantDetail onAddReview={addReview} /></PageLayout>}
        />
        <Route path="*" element={<PageLayout><NotFound /></PageLayout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
