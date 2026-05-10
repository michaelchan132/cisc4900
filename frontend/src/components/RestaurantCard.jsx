import { Link } from "react-router-dom"

function RestaurantCard({ restaurant }) {
  const averageRating = restaurant.average_rating
  const ratingText = averageRating ? averageRating.toFixed(1) : "No ratings yet"
  return (
    <article className="panel restaurant-card">
      <header className="restaurant-card__header">
        <h2>{restaurant.dba}</h2>
        <span className="restaurant-card__rating">⭐ {ratingText}</span>
      </header>
      <p className="restaurant-card__cuisine">{restaurant.cuisine_description}</p>
      <div className="restaurant-card__footer">
        <Link className="restaurant-card__link" to={`/restaurants/${restaurant.id}`}>
          View Details
        </Link>
      </div>
    </article>
  )
}

export default RestaurantCard
