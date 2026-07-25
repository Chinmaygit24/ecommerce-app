import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { cartItems, refreshCart, updateQuantity, removeItem, cartTotal } = useCart()
  const navigate = useNavigate()

  useEffect(() => { refreshCart() }, [refreshCart])

  if (cartItems.length === 0) {
    return (
      <div className="page">
        <p className="empty-state">Your cart is empty. <Link to="/">Continue shopping</Link></p>
      </div>
    )
  }

  return (
    <div className="page">
      <h1>Your Cart</h1>
      <div className="cart-list">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-row">
            <div className="cart-row-info">
              <h3>{item.product.name}</h3>
              <p>₹{item.product.price} each</p>
            </div>
            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
            />
            <p className="cart-row-subtotal">₹{(item.product.price * item.quantity).toFixed(2)}</p>
            <button className="btn-link danger" onClick={() => removeItem(item.id)}>Remove</button>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <p>Total: <strong>₹{cartTotal.toFixed(2)}</strong></p>
        <button className="btn-primary" onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
      </div>
    </div>
  )
}
