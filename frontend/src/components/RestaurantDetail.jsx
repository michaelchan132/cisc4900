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
    return <p className="restaurant-detail__status">Loading restaurant details...</p>
  }

  if (!restaurant) {
    return (
      <div className="page-content">
        <div className="panel restaurant-detail restaurant-detail--empty">
          <p>Restaurant not found.</p>
          <Link className="restaurant-detail__back-link" to="/restaurants">Back to list</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content">
      <section className="panel restaurant-detail">
        <div className="restaurant-detail__header">
          <div>
            <h1 className="restaurant-detail__name">{restaurant.dba}</h1>
            <p className="restaurant-detail__cuisine">{restaurant.cuisine_description}</p>
          </div>
          <span className="restaurant-detail__badge">{restaurant.boro}</span>
        </div>

        <div className="restaurant-detail__meta">
          <p>{restaurant.street}</p>
          <p>{restaurant.zipcode}</p>
        </div>

        <div className="restaurant-detail__reviews panel">
          <ReviewList reviews={restaurant.reviews || []} />
        </div>

        <div className="restaurant-detail__add-review panel">
          <AddReviewForm restaurantId={restaurant.id} onAddReview={onAddReview} />
        </div>

        <Link className="restaurant-detail__back-link" to="/restaurants">Back to list</Link>
      </section>
    </div>
  )
}

export default RestaurantDetail
