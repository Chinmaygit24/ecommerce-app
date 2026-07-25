import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { cartCount } = useCart()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="brand">Urban<span>Cart</span></Link>
        <nav className="nav-links">
          <Link to="/">Shop</Link>
          {isAdmin && <Link to="/admin">Admin</Link>}
          {user && <Link to="/orders">Orders</Link>}
          <Link to="/cart" className="cart-link">
            Cart{cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          {user ? (
            <>
              <span className="nav-user">Hi, {user.name.split(' ')[0]}</span>
              <button className="btn-link" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn-primary-sm">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
