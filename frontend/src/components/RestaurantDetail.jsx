import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import api from "../api"
import AddReviewForm from "./AddReviewForm"
import ReviewList from "./ReviewList"

function RestaurantDetail({ onAddReview }) {
  const { id } = useParams()
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await api.get(`/api/restaurants/${id}/`)
        setRestaurant(response.data)
      } catch (error) {
        console.log(error)
        setRestaurant(null)
      } finally {
        setLoading(false)
      }
    }

    fetchRestaurant()
  }, [id])

  const handleAddReview = (review) => {
    if (!restaurant) {
      return
    }

    setRestaurant((current) => ({
      ...current,
      reviews: [...(current.reviews || []), review],
    }))

    onAddReview(restaurant.id, review)
  }

  if (loading) {
    return <p>Loading restaurant details...</p>
  }

  if (!restaurant) {
    return (
      <div>
        <p>Restaurant not found.</p>
        <Link to="/restaurants">Back to list</Link>
      </div>
    )
  }

  return (
    <div>
      <h1>{restaurant.dba}</h1>
      <p>{restaurant.cuisine_description}</p>
      <p>{restaurant.street}</p>
      <p>{restaurant.boro}</p>
      <p>{restaurant.zipcode}</p>
      <ReviewList reviews={restaurant.reviews || []} />
      <AddReviewForm restaurantId={restaurant.id} onAddReview={onAddReview} />
      <Link to="/restaurants">Back to list</Link>
    </div>
  )
}

export default RestaurantDetail
