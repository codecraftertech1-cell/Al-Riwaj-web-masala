import { useState, useEffect } from 'react'
import { getMedia } from '../services/api'

export default function Media() {
  const [mediaItems, setMediaItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await getMedia()
        if (response.success) {
          setMediaItems(response.data)
        } else {
          setError('Failed to load media')
        }
      } catch (err) {
        console.error('Error fetching media:', err)
        setError('Error loading media')
      } finally {
        setLoading(false)
      }
    }

    fetchMedia()
  }, [])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  }

  return (
    <div className="page inner">
      <section className="inner-hero">
        <div className="container">
          <p className="eyebrow">Media</p>
          <h1>News & Updates</h1>
          <p className="lead">
            Latest announcements, campaigns, and brand stories.
          </p>
        </div>
      </section>

      <section className="inner-section">
        <div className="container">
          {loading ? (
            <p>Loading media...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : mediaItems.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              No media items yet. Admin will add updates soon.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {mediaItems.map((post, index) => (
                <article key={post.id || post.caption} className="reveal" style={{ 
                  padding: '30px 0',
                  borderBottom: index < mediaItems.length - 1 ? '3px solid #D4AF37' : 'none'
                }}>
                  {/* Heading - White color */}
                  <h3 style={{ 
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '10px'
                  }}>
                    {post.caption || post.title}
                  </h3>
                  
                  {/* Date - Red background */}
                  <span style={{ 
                    display: 'inline-block',
                    backgroundColor: '#dc3545',
                    color: '#ffffff',
                    padding: '5px 15px',
                    borderRadius: '4px',
                    fontSize: '13px',
                    fontWeight: '600',
                    marginBottom: '15px'
                  }}>
                    {formatDate(post.created_at)}
                  </span>
                  
                  {/* Description */}
                  <p style={{ color: '#ffffff', lineHeight: '1.7', fontSize: '16px', maxWidth: '800px' }}>
                    {post.alt_text || "Discover what's new at Al-Riwaj and how we keep elevating your culinary experience."}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
