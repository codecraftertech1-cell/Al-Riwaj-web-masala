import { useState, useEffect } from 'react'
import { getSectionByKey } from '../services/api'

export default function Founder() {
  const [section, setSection] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await getSectionByKey('founder')
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
          <h1>{section?.title || 'Our Founder'}</h1>
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
                alt={section?.title || 'Our Founder'} 
                style={{ 
                  width: '100%', 
                  maxWidth: '600px', 
                  height: '400px',
                  objectFit: 'cover',
                  borderRadius: '16px'
                }}
              />
              <div style={{ textAlign: 'center', maxWidth: '800px' }}>
                <h2 style={{ marginBottom: '20px' }}>{section?.title || 'Our Founder'}</h2>
                <div dangerouslySetInnerHTML={{ __html: section?.content || '<p>The story of Al-Riwaj begins with our visionary founder...</p>' }} />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
