import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-image">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} />
        ) : (
          <div className="product-image-placeholder">{product.name.charAt(0)}</div>
        )}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-price">₹{product.price}</p>
        {product.stockQuantity === 0 && <span className="out-of-stock">Out of stock</span>}
      </div>
    </Link>
  )
}
