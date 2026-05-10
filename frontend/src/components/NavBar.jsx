import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav className="top-nav">
      <Link className="top-nav__link" to="/">Home</Link>
      {" | "}
      <Link className="top-nav__link" to="/restaurants">Restaurants</Link>
      {" | "}
      <Link className="top-nav__link" to="/login">Login</Link>
      {" | "}
      <Link className="top-nav__link" to="/register">Register</Link>
      {" | "}
      <Link className="top-nav__link" to="/logout">Logout</Link>
    </nav>
  )
}

export default Navbar
