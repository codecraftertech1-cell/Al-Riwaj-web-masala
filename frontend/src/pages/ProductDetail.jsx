import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getProducts } from '../services/api'

export default function ProductDetail() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // First get all products to find by slug
        const productsRes = await getProducts()
        
        if (productsRes.success) {
          const foundProduct = productsRes.data.find((item) => item.slug === slug)
          
          if (foundProduct) {
            setProduct(foundProduct)
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [slug])

  if (loading) {
    return (
      <div className="page inner">
        <section className="inner-section">
          <div className="container">
            <p>Loading...</p>
          </div>
        </section>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="page inner">
        <section className="inner-section">
          <div className="container">
            <h2>Product not found</h2>
            <Link className="text-link" to="/shop">
              Back to shop
            </Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="page inner">
      <section className="inner-hero">
        <div className="container">
          <p className="eyebrow">Product</p>
          <h1>{product.name}</h1>
        </div>
      </section>

      <section className="inner-section">
        <div className="container product-detail-3d">
          {/* Left Side - 3D Image */}
          <div className="product-3d-image reveal">
            <div className="product-3d-card">
              <img 
                src={product.image ? `http://localhost:8000/${product.image}` : '/brand/hero.jpeg'} 
                alt={product.name} 
              />
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="product-3d-content reveal">
            <div className="product-3d-info">
              <h2>{product.name}</h2>
              
              {/* Description from admin */}
              <div className="product-description">
                <p>{product.description || product.short_description || 'No description available.'}</p>
              </div>

              <div className="product-actions">
                <Link className="hero-btn" to="/products">
                  Back to Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
