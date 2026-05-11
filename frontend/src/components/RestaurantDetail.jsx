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

  const inspections = restaurant?.inspections || []

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

        <div className="restaurant-detail__inspections panel">
          <h3>Inspection Grades</h3>
          {inspections.length === 0 ? (
            <p className="restaurant-detail__inspections-empty">No inspection grades available.</p>
          ) : (
            <ul className="restaurant-detail__inspections-list">
              {inspections.slice(0, 5).map((inspection) => (
                <li key={inspection.id} className="restaurant-detail__inspections-item">
                  <span>{inspection.inspection_date}</span>
                  <strong>{inspection.grade || "N/A"}</strong>
                </li>
              ))}
            </ul>
          )}
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
