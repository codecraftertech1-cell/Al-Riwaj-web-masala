import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, getCategories, createOrder } from '../services/api'

export default function Shop() {
  const [filter, setFilter] = useState('all')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(Date.now())
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState('')
  const [orderData, setOrderData] = useState({
    customer_name: '',
    phone: '',
    address: '',
    city: '',
    quantity: '',
    notes: ''
  })
  const [orderLoading, setOrderLoading] = useState(false)
  const [orderMessage, setOrderMessage] = useState({ type: '', text: '' })

  // Get image URL - use absolute URL to Laravel backend
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/brand/hero.jpeg'
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

  const handleOrderSubmit = async (e) => {
    e.preventDefault()
    setOrderLoading(true)
    setOrderMessage({ type: '', text: '' })

    try {
      const response = await createOrder({
        ...orderData,
        product_id: selectedProduct,
        quantity: parseInt(orderData.quantity) || 1,
        status: 'pending'
      })
      
      if (response.success) {
        setOrderMessage({ type: 'success', text: '✅ Order submitted successfully! We will contact you soon.' })
        setOrderData({
          customer_name: '',
          phone: '',
          address: '',
          city: '',
          quantity: '',
          notes: ''
        })
        setSelectedProduct('')
      }
    } catch (error) {
      setOrderMessage({ type: 'error', text: '❌ Failed to submit order. Please try again.' })
    } finally {
      setOrderLoading(false)
    }
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
          <button 
            className="hero-btn" 
            onClick={() => setShowOrderForm(!showOrderForm)}
            style={{ marginTop: '1rem' }}
          >
            {showOrderForm ? 'View Products' : 'Place Bulk Order'}
          </button>
        </div>
      </section>

      {showOrderForm ? (
        <section className="inner-section" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', minHeight: '80vh' }}>
          <div className="container">
            <div className="auth-card reveal" style={{ maxWidth: '700px', margin: '0 auto', 
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            borderRadius: '16px'
          }}>
              <h2>Bulk Order Form</h2>
              <p className="lead" style={{ marginBottom: '2rem' }}>
                Order Al-Riwaj products in bulk. Minimum order: 1 box
              </p>

              {orderMessage.text && (
                <div style={{ 
                  padding: '1rem', 
                  marginBottom: '1.5rem', 
                  borderRadius: '8px',
                  background: orderMessage.type === 'success' ? '#d4edda' : '#f8d7da',
                  color: orderMessage.type === 'success' ? '#155724' : '#721c24'
                }}>
                  {orderMessage.text}
                </div>
              )}

              <form onSubmit={handleOrderSubmit}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#fff' }}>
                    Select Product *
                  </label>
                  <select
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      fontSize: '1rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      backdropFilter: 'blur(5px)'
                    }}
                  >
                    <option value="" style={{ color: '#333' }}>-- Select a Product --</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id} style={{ color: '#333' }}>
                        {product.name} - PKR {product.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#fff' }}>
                      Your Name *
                    </label>
                    <input 
                      type="text"
                      placeholder="Enter your full name"
                      value={orderData.customer_name}
                      onChange={(e) => setOrderData({...orderData, customer_name: e.target.value})}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        fontSize: '1rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                        backdropFilter: 'blur(5px)'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#fff' }}>
                      Phone Number *
                    </label>
                    <input 
                      type="tel"
                      placeholder="03XX-XXXXXXX"
                      value={orderData.phone}
                      onChange={(e) => setOrderData({...orderData, phone: e.target.value})}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        fontSize: '1rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                        backdropFilter: 'blur(5px)'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#fff' }}>
                    Delivery Address *
                  </label>
                  <input 
                    type="text"
                    placeholder="Full delivery address"
                    value={orderData.address}
                    onChange={(e) => setOrderData({...orderData, address: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      fontSize: '1rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      backdropFilter: 'blur(5px)'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#fff' }}>
                      City *
                    </label>
                    <input 
                      type="text"
                      placeholder="Enter city"
                      value={orderData.city}
                      onChange={(e) => setOrderData({...orderData, city: e.target.value})}
                      required
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        fontSize: '1rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                        backdropFilter: 'blur(5px)'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#fff' }}>
                      Quantity (Boxes) *
                    </label>
                    <input 
                      type="number"
                      placeholder="Order 1 box, box or above"
                      value={orderData.quantity}
                      onChange={(e) => setOrderData({...orderData, quantity: e.target.value})}
                      required
                      min="1"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        fontSize: '1rem',
                        background: 'rgba(255, 255, 255, 0.1)',
                        color: '#fff',
                        backdropFilter: 'blur(5px)'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#fff' }}>
                    Additional Notes
                  </label>
                  <textarea 
                    placeholder="Any special instructions..."
                    value={orderData.notes}
                    onChange={(e) => setOrderData({...orderData, notes: e.target.value})}
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      fontSize: '1rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      color: '#fff',
                      backdropFilter: 'blur(5px)',
                      resize: 'vertical'
                    }}
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={orderLoading}
                  onMouseOver={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #28a745 0%, #218838 100%)';
                    e.target.style.transform = 'scale(1.02)';
                    e.target.style.boxShadow = '0 8px 25px rgba(40, 167, 69, 0.5)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                  }}
                  style={{ 
                    width: '100%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    color: '#fff',
                    padding: '1rem 2rem',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    borderRadius: '30px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    marginTop: '1rem',
                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                  }}
                >
                  {orderLoading ? (
                    'Submitting...'
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                        <polyline points="22 4 12 14.01 9 11.01"/>
                      </svg>
                      Submit Order
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>
      ) : (
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
      )}
    </div>
  )
}
