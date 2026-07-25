import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [message, setMessage] = useState('')
  const { user } = useAuth()
  const { addToCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    api.get(`/products/${id}`).then(({ data }) => setProduct(data))
  }, [id])

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    await addToCart(product.id, quantity)
    setMessage('Added to cart!')
    setTimeout(() => setMessage(''), 2000)
  }

  if (!product) return <p className="empty-state">Loading...</p>

  return (
    <div className="page product-detail">
      <div className="product-detail-image">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} />
        ) : (
          <div className="product-image-placeholder large">{product.name.charAt(0)}</div>
        )}
      </div>
      <div className="product-detail-info">
        <h1>{product.name}</h1>
        <p className="product-detail-price">₹{product.price}</p>
        <p className="product-detail-description">{product.description}</p>
        <p className="stock-info">
          {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
        </p>

        {product.stockQuantity > 0 && (
          <div className="add-to-cart-row">
            <input
              type="number"
              min="1"
              max={product.stockQuantity}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
            <button className="btn-primary" onClick={handleAddToCart}>Add to Cart</button>
          </div>
        )}
        {message && <p className="success-message">{message}</p>}
      </div>
    </div>
  )
}
