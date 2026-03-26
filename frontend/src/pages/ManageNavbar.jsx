import { useState, useEffect } from 'react'
import { getNavbarSettings, updateNavbarSettings } from '../services/api'

export default function ManageNavbar() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    loadNavbarSettings()
  }, [])

  const loadNavbarSettings = async () => {
    try {
      const response = await getNavbarSettings()
      if (response.success) {
        setItems(response.data)
      }
    } catch (error) {
      console.error('Error loading navbar settings:', error)
      setItems([
        { key: 'home', label: 'Home', url: '/', visible: true },
        { key: 'about', label: 'About', url: '/about', visible: true },
        { key: 'shop', label: 'Shop', url: '/shop', visible: true },
        { key: 'our-management', label: 'Our Management', url: '#', visible: true },
        { key: 'products', label: 'Products', url: '/products', visible: true },
        { key: 'recipes', label: 'Recipes', url: '/recipes', visible: true },
        { key: 'media', label: 'Media', url: '/media', visible: true },
        { key: 'careers', label: 'Careers', url: '/careers', visible: true },
        { key: 'contact', label: 'Contact Us', url: '/contact', visible: true },
      ])
    } finally {
      setLoading(false)
    }
  }

  const toggleVisibility = (key) => {
    setItems(items.map(item => 
      item.key === key ? { ...item, visible: !item.visible } : item
    ))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage({ type: '', text: '' })
    
    try {
      const response = await updateNavbarSettings({ items })
      if (response.success) {
        setMessage({ type: 'success', text: '✅ Navbar settings saved successfully!' })
      }
    } catch (error) {
      console.error('Error saving navbar settings:', error)
      setMessage({ type: 'error', text: '❌ Failed to save settings' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="page inner">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page inner">
      <section className="inner-hero">
        <div className="container">
          <p className="eyebrow">Admin Panel</p>
          <h1>Manage Navbar</h1>
          <p className="lead">
            Control which menu items appear in the website navigation bar.
          </p>
        </div>
      </section>

      <section className="inner-section">
        <div className="container">
          <div className="admin-card reveal">
            <div className="admin-header">
              <h2>Navbar Menu Items</h2>
              <button 
                className="hero-btn"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  padding: '0.75rem 2rem',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {message.text && (
              <div style={{ 
                padding: '1rem', 
                marginBottom: '1rem', 
                borderRadius: '4px',
                background: message.type === 'success' ? '#d4edda' : '#f8d7da',
                color: message.type === 'success' ? '#155724' : '#721c24'
              }}>
                {message.text}
              </div>
            )}

            <table className="admin-table">
              <thead>
                <tr>
                  <th>Menu Item</th>
                  <th>URL</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.key}>
                    <td>
                      <strong>{item.label}</strong>
                    </td>
                    <td>
                      <code style={{ fontSize: '0.85rem' }}>{item.url}</code>
                    </td>
                    <td>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.4rem 1rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        background: item.visible ? '#d4edda' : '#f8d7da',
                        color: item.visible ? '#155724' : '#721c24',
                        border: `1px solid ${item.visible ? '#c3e6cb' : '#f5c6cb'}`
                      }}>
                        {item.visible ? '✓ Visible' : '✗ Hidden'}
                      </span>
                    </td>
                    <td>
                      {item.visible ? (
                        <button
                          onClick={() => toggleVisibility(item.key)}
                          style={{ 
                            minWidth: '100px',
                            padding: '0.6rem 1.2rem',
                            border: 'none',
                            borderRadius: '25px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            margin: '0 auto',
                            background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
                            color: '#fff',
                            boxShadow: '0 4px 15px rgba(231, 76, 60, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                            <line x1="1" y1="1" x2="23" y2="23"/>
                          </svg>
                          Hide
                        </button>
                      ) : (
                        <button
                          onClick={() => toggleVisibility(item.key)}
                          style={{ 
                            minWidth: '100px',
                            padding: '0.6rem 1.2rem',
                            border: 'none',
                            borderRadius: '25px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            margin: '0 auto',
                            background: 'linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)',
                            color: '#fff',
                            boxShadow: '0 4px 15px rgba(46, 204, 113, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                          Show
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: '12px', border: '1px solid #e9ecef' }}>
              <h4 style={{ marginBottom: '1rem', color: '#495057', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                Live Preview
              </h4>
              <div style={{ 
                display: 'flex', 
                gap: '0.75rem', 
                flexWrap: 'wrap',
                padding: '1.25rem',
                background: '#fff',
                border: '2px solid #dee2e6',
                borderRadius: '8px',
                minHeight: '60px',
                alignItems: 'center'
              }}>
                {items.filter(item => item.visible).map((item) => (
                  <span 
                    key={item.key}
                    style={{
                      padding: '0.6rem 1.2rem',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: '#fff',
                      borderRadius: '25px',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    {item.label}
                  </span>
                ))}
                {items.filter(item => item.visible).length === 0 && (
                  <span style={{ color: '#999', fontStyle: 'italic' }}>No menu items visible - please enable at least one item</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
