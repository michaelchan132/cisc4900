import { Link } from "react-router-dom"

function RestaurantCard({ restaurant }) {
  return (
    <div>
      <h2>{restaurant.dba}</h2>
      <p>{restaurant.cuisine_description}</p>
      <Link to={`/restaurants/${restaurant.id}`}>View Details</Link>
    </div>
  )
}

export default RestaurantCard
