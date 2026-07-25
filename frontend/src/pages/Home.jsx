import { useEffect, useState } from 'react'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/categories').then(({ data }) => setCategories(data)).catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    const params = { page, size: 12 }
    if (search) params.name = search
    if (categoryId) params.categoryId = categoryId

    api.get('/products', { params })
      .then(({ data }) => {
        setProducts(data.content)
        setTotalPages(data.totalPages)
      })
      .finally(() => setLoading(false))
  }, [search, categoryId, page])

  return (
    <div className="page">
      <section className="hero">
        <h1>Everyday essentials, delivered with care.</h1>
        <p>Browse the catalog, add what you need, checkout in seconds.</p>
      </section>

      <div className="filters">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
        />
        <select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setPage(0) }}>
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="empty-state">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="empty-state">No products found. Try a different search.</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 0} onClick={() => setPage((p) => p - 1)}>Previous</button>
          <span>Page {page + 1} of {totalPages}</span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}>Next</button>
        </div>
      )}
    </div>
  )
}
