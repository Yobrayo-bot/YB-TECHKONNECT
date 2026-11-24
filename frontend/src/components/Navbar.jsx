
import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <header className="navbar">

      <Link to="/" className="brand">
        YB <span>TECHKONNECT</span>
      </Link>

      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/services">Services</Link>
        <Link to="/technicians">Find a Technician</Link>
        <Link to="/about">About Us</Link>
      </nav>

      <div className="nav-actions">
        <Link to="/login" className="login-link">
          Login
        </Link>

        <Link to="/register" className="nav-button">
          Become a Technician
        </Link>
      </div>

    </header>
  )
}

export default Navbar
