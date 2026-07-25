import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function OrderHistory() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    api.get('/orders').then(({ data }) => setOrders(data))
  }, [])

  if (orders.length === 0) {
    return <div className="page"><p className="empty-state">You haven't placed any orders yet.</p></div>
  }

  return (
    <div className="page">
      <h1>Your Orders</h1>
      <div className="order-list">
        {orders.map((order) => (
          <div key={order.id} className="order-card">
            <div className="order-card-header">
              <span>Order #{order.id}</span>
              <span className={`status-badge status-${order.status.toLowerCase()}`}>{order.status}</span>
            </div>
            <ul>
              {order.items.map((item) => (
                <li key={item.id}>{item.product.name} × {item.quantity} — ₹{item.priceAtPurchase}</li>
              ))}
            </ul>
            <p className="order-total">Total: ₹{order.totalAmount}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
