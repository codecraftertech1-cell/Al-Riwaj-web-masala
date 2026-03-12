import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategories, getProducts, getFeaturedProducts } from '../services/api'

export default function Products() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(Date.now())

  // Get image URL - use absolute URL to Laravel backend
  const getImageUrl = (imagePath) => {
    if (!imagePath) return '/brand/hero.jpeg'
    return `http://localhost:8000/${imagePath}?t=${lastUpdate}`
  }

  // Fetch data from Laravel API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        const [categoriesRes, productsRes, featuredRes] = await Promise.all([
          getCategories(),
          getProducts(),
          getFeaturedProducts()
        ])

        if (categoriesRes?.success) {
          setCategories(categoriesRes.data)
        }

        if (productsRes?.success) {
          setProducts(productsRes.data)
          setLastUpdate(Date.now())
        }

        if (featuredRes?.success) {
          setFeaturedProducts(featuredRes.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Featured section - show from products
  const displayFeatured = featuredProducts.length > 0 
    ? featuredProducts.slice(0, 6).map(p => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        blurb: p.short_description || 'Explore our products',
        image: getImageUrl(p.image)
      }))
    : products.slice(0, 6).map(p => ({
        id: p.id,
        slug: p.slug,
        name: p.name,
        blurb: p.short_description || 'Explore our products',
        image: getImageUrl(p.image)
      }))

  // All products with images
  const displayProducts = products.map(p => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price,
    short_description: p.short_description,
    description: p.description,
    image: getImageUrl(p.image)
  }))

  if (loading) {
    return (
      <div className="page inner">
        <section className="inner-hero">
          <div className="container">
            <p className="eyebrow">Products</p>
            <h1>Our Range</h1>
            <p className="lead">Loading products...</p>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="page inner">
      <section className="inner-hero">
        <div className="container">
          <p className="eyebrow">Products</p>
          <h1>Our Range</h1>
          <p className="lead">
            Explore our complete range of mixes, sauces, spices, and staples.
            {products.length > 0 ? ` (${products.length} products available)` : ''}
          </p>
        </div>
      </section>

      <section className="inner-section">
        <div className="container">
          <p className="eyebrow">All</p>
          <h2 className="stacked-title">
            <span>Product</span>
            <span>Lines</span>
          </h2>
          {products.length > 0 ? (
            <div className="grid">
              {displayProducts.map((item, index) => (
                <div key={item.id || item.slug} className="product-card reveal">
                  <div className="product-image-container">
                    <img 
                      className="product-photo"
                      src={item.image}
                      alt={item.name}
                    />
                  </div>
                  <div className="card-content">
                    <h3>{item.name}</h3>
                    <p>{item.short_description || item.description}</p>
                    <Link className="text-link" to={`/products/${item.slug}`}>
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="lead">No products available.</p>
          )}
        </div>
      </section>
    </div>
  )
}
