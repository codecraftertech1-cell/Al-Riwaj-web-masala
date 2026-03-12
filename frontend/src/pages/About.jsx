import { useEffect, useState } from 'react'

export default function About() {
  const [aboutData, setAboutData] = useState(null)

  useEffect(() => {
    const savedData = localStorage.getItem('homePageData')
    if (savedData) {
      setAboutData(JSON.parse(savedData))
    }
  }, [])

  return (
    <div className="page inner">
      <section className="inner-hero">
        <div className="container">
          <p className="eyebrow">About</p>
          <h1>Al-Riwaj Foods</h1>
          <p className="lead">
            Rooted in heritage, crafted for today. We bring authentic Pakistani
            flavors to the world with rigorous quality and modern convenience.
          </p>
        </div>
      </section>

      <section className="inner-section reveal">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem' }}>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.15)', 
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: '24px', 
            padding: '2.5rem', 
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <img 
              src={aboutData?.aboutStoryImage || '/brand/about.png'} 
              alt="Our Story" 
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '16px', marginBottom: '1.5rem' }}
            />
            <h2 style={{ marginBottom: '1rem' }}>Our Story</h2>
            <p style={{ lineHeight: '1.8', opacity: 0.9 }}>
              {aboutData?.aboutStory || 'From a small kitchen tradition to a global pantry essential, Al-Riwaj has always focused on authenticity, consistency, and trust.'}
            </p>
          </div>
          <div style={{ 
            background: 'rgba(255, 255, 255, 0.15)', 
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            borderRadius: '24px', 
            padding: '2.5rem', 
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <img 
              src={aboutData?.aboutPurposeImage || '/brand/about.jpg'} 
              alt="Our Purpose" 
              style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '16px', marginBottom: '1.5rem' }}
            />
            <h2 style={{ marginBottom: '1rem' }}>Our Purpose</h2>
            <p style={{ lineHeight: '1.8', opacity: 0.9 }}>
              {aboutData?.aboutPurpose || 'To preserve the taste of home while making cooking effortless and joyful for families everywhere.'}
            </p>
          </div>
        </div>
      </section>

      <section className="inner-section">
        <div className="container">
          <div className="stats" style={{ display: 'flex', justifyContent: 'center', gap: '4rem', textAlign: 'center' }}>
            <div>
              <h3 style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>150+</h3>
              <p>Products & blends</p>
            </div>
            <div>
              <h3 style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>30 yrs</h3>
              <p>Heritage & trust</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
