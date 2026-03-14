import { Link } from "react-router-dom"

function Home() {
    return (
    <main>
      <h1>Welcome</h1>
      <p>Search restaurants, read reviews, and share your own dining experiences.</p>
      <p>
        <Link to="/restaurants">Browse Restaurants</Link>
      </p>
    </main>
  )
}

export default Home