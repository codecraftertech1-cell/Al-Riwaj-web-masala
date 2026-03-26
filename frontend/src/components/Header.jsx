import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getProducts, getProduct, getNavbarSettings } from '../services/api'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [quickViewLoading, setQuickViewLoading] = useState(false)
  const [navbarItems, setNavbarItems] = useState([])
  const navigate = useNavigate()

  // Close quick view on escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setQuickViewProduct(null)
        setSearchOpen(false)
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [])

  // Fetch navbar visibility settings
  useEffect(() => {
    const fetchNavbarSettings = async () => {
      try {
        const response = await getNavbarSettings()
        if (response.success) {
          setNavbarItems(response.data)
        }
      } catch (error) {
        console.error('Error fetching navbar settings:', error)
      }
    }
    fetchNavbarSettings()
  }, [])

  const handleSearch = async (e) => {
    const query = e.target.value
    setSearchQuery(query)
    
    if (query.length > 2) {
      setLoading(true)
      try {
        const response = await getProducts({ search: query })
        if (response.success) {
          setSearchResults(response.data.slice(0, 5))
        }
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setLoading(false)
      }
    } else {
      setSearchResults([])
    }
  }

  const handleResultClick = async (product) => {
    setQuickViewLoading(true)
    setSearchOpen(false)
    setSearchQuery('')
    setSearchResults([])
    
    try {
      // Fetch full product details
      const response = await getProduct(product.id)
      if (response.success) {
        setQuickViewProduct(response.data)
      }
    } catch (error) {
      console.error('Error loading product:', error)
    } finally {
      setQuickViewLoading(false)
    }
  }

  const closeQuickView = () => {
    setQuickViewProduct(null)
  }

  return (
    <>
      <header className="topbar">
        <div className="container topbar-inner">
          <div className="topbar-left">
            <span className="dot" />
            <span>Pakistan</span>
          </div>
          <div className="topbar-right">
            <span>Follow us</span>
            <div className="social">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link facebook" aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link instagram" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="social-link youtube" aria-label="YouTube">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="#fff">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </header>

      <nav className="nav">
        <div className="container nav-inner">
          <NavLink className="logo" to="/">
            <img src="/brand/logo.png" alt="Al-Riwaj" />
          </NavLink>
          <ul className={`nav-links ${open ? 'open' : ''}`}>
            {navbarItems.find(item => item.key === 'home')?.visible !== false && (
              <li className="nav-item">
                <NavLink to="/">Home</NavLink>
              </li>
            )}
            {navbarItems.find(item => item.key === 'about')?.visible !== false && (
              <li className="nav-item">
                <NavLink to="/about">About</NavLink>
              </li>
            )}
            {navbarItems.find(item => item.key === 'shop')?.visible !== false && (
              <li className="nav-item">
                <NavLink to="/shop">Shop</NavLink>
              </li>
            )}
            {navbarItems.find(item => item.key === 'our-management')?.visible !== false && (
              <li className="nav-item has-mega">
                Our Management
                <div className="mega">
                  <div>
                    <h4>Leadership</h4>
                    <a href="/founder">Our Founder</a>
                    <a href="/board-of-directors">Board of Directors</a>
                    <a href="/ceo">Meet The CEO</a>
                    <a href="/managing-committee">Managing Committee</a>
                  </div>
                  <div>
                    <h4>Brands</h4>
                    <a href="#">Al-Riwaj</a>
                    <a href="#">Recipe Mixes</a>
                    <a href="#">Plain Spices</a>
                    
                  </div>
                  <div>
                    <h4>More</h4>
                    <a href="/media">Media</a>
                    <a href="/careers">Careers</a>
                    <a href="/contact">Contact Us</a>
                  </div>
                </div>
              </li>
            )}
            {navbarItems.find(item => item.key === 'products')?.visible !== false && (
              <li className="nav-item">
                <NavLink to="/products">Products</NavLink>
              </li>
            )}
            {navbarItems.find(item => item.key === 'recipes')?.visible !== false && (
              <li className="nav-item">
                <NavLink to="/recipes">Recipes</NavLink>
              </li>
            )}
            {navbarItems.find(item => item.key === 'media')?.visible !== false && (
              <li className="nav-item">
                <NavLink to="/media">Media</NavLink>
              </li>
            )}
            {navbarItems.find(item => item.key === 'careers')?.visible !== false && (
              <li className="nav-item">
                <NavLink to="/careers">Careers</NavLink>
              </li>
            )}
            {navbarItems.find(item => item.key === 'contact')?.visible !== false && (
              <li className="nav-item">
                <NavLink to="/contact">Contact Us</NavLink>
              </li>
            )}            
          </ul>
          <div className="nav-actions">
            {/* Search Bar */}
            <div className={`search-container ${searchOpen ? 'search-open' : ''}`}>
              <button 
                className="search-toggle"
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Search"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="m21 21-4.35-4.35"/>
                </svg>
              </button>
              <div className="search-dropdown">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="search-input"
                  autoFocus
                />
                  {loading && <div className="search-loading">Searching...</div>}
                  {searchResults.length > 0 && (
                    <div className="search-results">
                      {searchResults.map(product => (
                        <div 
                          key={product.id} 
                          className="search-result-item"
                          onClick={() => handleResultClick(product)}
                        >
                          <div className="search-result-image">
                            <img 
                              src={product.image || '/brand/hero.jpeg'} 
                              alt={product.name}
                            />
                          </div>
                          <div className="search-result-info">
                            <div className="search-result-name">{product.name}</div>
                            <div className="search-result-category">{product.category?.name}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {searchQuery.length > 2 && searchResults.length === 0 && !loading && (
                    <div className="search-no-results">No products found</div>
                  )}
                </div>
              </div>
            <Link to="/distributor" className="nav-cta">Become a Distributor</Link>
            <button
              className="nav-toggle"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <div className="quick-view-overlay" onClick={closeQuickView}>
          <div className="quick-view-modal" onClick={(e) => e.stopPropagation()}>
            <button className="quick-view-close" onClick={closeQuickView}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6 6 18M6 6l12 12"/>
              </svg>
            </button>
            <div className="quick-view-content">
              <div className="quick-view-image">
                <img 
                  src={quickViewProduct.image || '/brand/hero.jpeg'} 
                  alt={quickViewProduct.name}
                />
              </div>
              <div className="quick-view-details">
                <h2 className="quick-view-title">{quickViewProduct.name}</h2>
                <p className="quick-view-description">
                  {quickViewProduct.description || quickViewProduct.short_description || 'No description available.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {quickViewLoading && (
        <div className="quick-view-loading">
          <div className="loading-spinner"></div>
        </div>
      )}
    </>
  )
}
