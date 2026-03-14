import { useMemo } from "react"
import { Link, useParams } from "react-router-dom"
import AddReviewForm from "./AddReviewForm"
import ReviewList from "./ReviewList"

function RestaurantDetail({ restaurants, onAddReview }) {
  const { id } = useParams()

  const restaurant = useMemo(
    () => restaurants.find((item) => String(item.id) === id),
    [restaurants, id],
  )

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
