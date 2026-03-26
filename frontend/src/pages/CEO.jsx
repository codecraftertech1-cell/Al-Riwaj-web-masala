import { useState, useEffect } from 'react'
import { getSectionByKey } from '../services/api'

export default function CEO() {
  const [section, setSection] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await getSectionByKey('ceo')
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
          <h1>{section?.title || 'Meet The CEO'}</h1>
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
                alt={section?.title || 'Meet The CEO'} 
                style={{ 
                  width: '100%', 
                  maxWidth: '600px', 
                  height: '400px',
                  objectFit: 'cover',
                  borderRadius: '16px'
                }}
              />
              <div style={{ textAlign: 'center', maxWidth: '800px' }}>
                <h2 style={{ marginBottom: '20px' }}>{section?.title || 'Meet The CEO'}</h2>
                <div dangerouslySetInnerHTML={{ __html: section?.content || '<p>Our CEO leads Al-Riwaj with passion and dedication...</p>' }} />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
