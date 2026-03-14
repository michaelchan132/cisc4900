import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      {" | "}
      <Link to="/restaurants">Restaurants</Link>
      {" | "}
      <Link to="/login">Login</Link>
      {" | "}
      <Link to="/register">Register</Link>
      {" | "}
      <Link to="/logout">Logout</Link>
    </nav>
  )
}

export default Navbar
