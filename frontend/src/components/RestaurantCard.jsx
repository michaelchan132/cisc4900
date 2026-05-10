import { Link } from "react-router-dom"

function RestaurantCard({ restaurant }) {
  return (
    <article className="panel restaurant-card">
      <h2>{restaurant.dba}</h2>
      <p>{restaurant.cuisine_description}</p>
      <Link to={`/restaurants/${restaurant.id}`}>View Details</Link>
    </article>
  )
}

export default RestaurantCard
