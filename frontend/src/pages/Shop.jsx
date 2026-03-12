import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, getCategories } from '../services/api'

export default function Shop() {
  const [filter, setFilter] = useState('all')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(Date.now())

  // Get image URL - use absolute URL to Laravel backend
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/brand/hero.jpeg'
    // Point to Laravel backend server (port 8000)
    return `http://localhost:8000/${imagePath}?t=${lastUpdate}`
  }

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, productsRes] = await Promise.all([
          getCategories(),
          getProducts()
        ])
        
        if (categoriesRes.success) {
          setCategories(categoriesRes.data)
        }
        
        if (productsRes.success) {
          setProducts(productsRes.data)
          setLastUpdate(Date.now())
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filtered = useMemo(() => {
    if (filter === 'all') return products
    return products.filter((item) => item.category_id == filter)
  }, [filter, products])

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c.id === categoryId)
    return category ? category.name : 'General'
  }

  return (
    <div className="page inner">
      <section className="inner-hero">
        <div className="container">
          <p className="eyebrow">Shop</p>
          <h1>Product Catalog</h1>
          <p className="lead">
            Discover every Al-Riwaj product with detail-rich packaging and bold
            flavors.
            {loading ? ' (Loading...)' : products.length > 0 ? ` (${products.length} products)` : ''}
          </p>
        </div>
      </section>

      <section className="inner-section">
        <div className="container">
          <div className="filters">
            <button
              className={filter === 'all' ? 'chip active' : 'chip'}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                className={filter === cat.id ? 'chip active' : 'chip'}
                onClick={() => setFilter(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {loading ? (
            <p>Loading products...</p>
          ) : filtered.length === 0 ? (
            <p className="lead">No products found.</p>
          ) : (
            <div className="grid shop-grid">
              {filtered.map((item) => (
                <article key={item.id || item.slug} className="product-card reveal">
                  <div className="product-image-container">
                    <img 
                      className="product-photo" 
                      src={getImageUrl(item.image)} 
                      alt={item.name} 
                    />
                  </div>
                  <div className="card-content">
                    <h3>{item.name}</h3>
                    <p className="muted">{getCategoryName(item.category_id)}</p>
                    <p>{item.short_description || item.description}</p>
                    <Link className="text-link" to={`/products/${item.slug}`}>
                      View Details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
