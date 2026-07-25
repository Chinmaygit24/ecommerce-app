import { useEffect, useState } from 'react'
import api from '../api/axios'

const emptyForm = { name: '', description: '', price: '', stockQuantity: '', imageUrl: '', categoryId: '' }

export default function AdminDashboard() {
  const [tab, setTab] = useState('products')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [orders, setOrders] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)

  const loadProducts = () => api.get('/products', { params: { size: 100 } }).then(({ data }) => setProducts(data.content))
  const loadOrders = () => api.get('/admin/orders').then(({ data }) => setOrders(data))

  useEffect(() => {
    loadProducts()
    api.get('/categories').then(({ data }) => setCategories(data))
    loadOrders()
  }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      price: parseFloat(form.price),
      stockQuantity: parseInt(form.stockQuantity, 10),
      categoryId: form.categoryId || null,
    }
    if (editingId) {
      await api.put(`/admin/products/${editingId}`, payload)
    } else {
      await api.post('/admin/products', payload)
    }
    setForm(emptyForm)
    setEditingId(null)
    loadProducts()
  }

  const handleEdit = (product) => {
    setEditingId(product.id)
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl || '',
      categoryId: product.category?.id || '',
    })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return
    await api.delete(`/admin/products/${id}`)
    loadProducts()
  }

  const handleStatusChange = async (orderId, status) => {
    await api.put(`/admin/orders/${orderId}/status`, { status })
    loadOrders()
  }

  return (
    <div className="page">
      <h1>Admin Dashboard</h1>
      <div className="admin-tabs">
        <button className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}>Products</button>
        <button className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>Orders</button>
      </div>

      {tab === 'products' && (
        <div className="admin-grid">
          <form className="admin-form" onSubmit={handleSubmit}>
            <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>
            <label>Name<input name="name" required value={form.name} onChange={handleChange} /></label>
            <label>Description<textarea name="description" value={form.description} onChange={handleChange} /></label>
            <label>Price (₹)<input name="price" type="number" step="0.01" required value={form.price} onChange={handleChange} /></label>
            <label>Stock Quantity<input name="stockQuantity" type="number" required value={form.stockQuantity} onChange={handleChange} /></label>
            <label>Image URL<input name="imageUrl" value={form.imageUrl} onChange={handleChange} /></label>
            <label>Category
              <select name="categoryId" value={form.categoryId} onChange={handleChange}>
                <option value="">None</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </label>
            <button className="btn-primary" type="submit">{editingId ? 'Update' : 'Create'}</button>
            {editingId && <button type="button" className="btn-link" onClick={() => { setEditingId(null); setForm(emptyForm) }}>Cancel edit</button>}
          </form>

          <div className="admin-list">
            {products.map((p) => (
              <div key={p.id} className="admin-list-row">
                <span>{p.name}</span>
                <span>₹{p.price}</span>
                <span>{p.stockQuantity} in stock</span>
                <button className="btn-link" onClick={() => handleEdit(p)}>Edit</button>
                <button className="btn-link danger" onClick={() => handleDelete(p.id)}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div className="admin-list">
          {orders.map((order) => (
            <div key={order.id} className="admin-order-row">
              <span>Order #{order.id} — {order.user.name}</span>
              <span>₹{order.totalAmount}</span>
              <select value={order.status} onChange={(e) => handleStatusChange(order.id, e.target.value)}>
                <option value="PENDING">PENDING</option>
                <option value="PAID">PAID</option>
                <option value="SHIPPED">SHIPPED</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
