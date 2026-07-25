import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useCart } from '../context/CartContext'

// NOTE: This simulates the payment confirmation step.
// In a production build, replace handlePayment with the real Razorpay/Stripe
// checkout widget, then call /orders/{id}/confirm-payment after the gateway
// verifies the payment signature server-side.
export default function Checkout() {
  const { cartItems, cartTotal, refreshCart } = useCart()
  const [processing, setProcessing] = useState(false)
  const navigate = useNavigate()

  const handlePayment = async () => {
    setProcessing(true)
    try {
      const { data: order } = await api.post('/orders/checkout')
      await api.post(`/orders/${order.id}/confirm-payment`)
      await refreshCart()
      navigate('/orders')
    } catch (err) {
      alert(err.response?.data?.message || 'Checkout failed. Please try again.')
    } finally {
      setProcessing(false)
    }
  }

  if (cartItems.length === 0) {
    return <div className="page"><p className="empty-state">Your cart is empty.</p></div>
  }

  return (
    <div className="page">
      <h1>Checkout</h1>
      <div className="checkout-summary">
        {cartItems.map((item) => (
          <div key={item.id} className="checkout-row">
            <span>{item.product.name} × {item.quantity}</span>
            <span>₹{(item.product.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="checkout-row total">
          <span>Total</span>
          <span>₹{cartTotal.toFixed(2)}</span>
        </div>
      </div>
      <button className="btn-primary" disabled={processing} onClick={handlePayment}>
        {processing ? 'Processing...' : 'Pay & Place Order'}
      </button>
    </div>
  )
}
