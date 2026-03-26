import { useState, useEffect } from 'react'
import { getSectionByKey } from '../services/api'

export default function BoardOfDirectors() {
  const [section, setSection] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await getSectionByKey('board')
        if (response.success) {
          setSection(response.data)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchContent()
  }, [])

  return (
    <div className="page inner">
      <section className="inner-hero">
        <div className="container">
          <p className="eyebrow">Our Management</p>
          <h1>{section?.title || 'Board of Directors'}</h1>
        </div>
      </section>

      <section className="inner-section">
        <div className="container">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '30px' }}>
              <img 
                src={section?.image ? (section.image.startsWith('/') ? section.image : '/' + section.image) : '/brand/about.png'} 
                alt={section?.title || 'Board of Directors'} 
                style={{ 
                  width: '100%', 
                  maxWidth: '600px', 
                  height: '400px',
                  objectFit: 'cover',
                  borderRadius: '16px'
                }}
              />
              <div style={{ textAlign: 'center', maxWidth: '800px' }}>
                <h2 style={{ marginBottom: '20px' }}>{section?.title || 'Board of Directors'}</h2>
                <div dangerouslySetInnerHTML={{ __html: section?.content || '<p>Our Board of Directors brings together diverse expertise...</p>' }} />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
