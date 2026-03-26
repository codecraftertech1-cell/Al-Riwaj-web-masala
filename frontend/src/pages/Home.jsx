import { useEffect, useState } from 'react'
import { getProducts, getSections } from '../services/api'
import { Link } from 'react-router-dom'

const features = [
  { title: 'Halal', detail: '100% Halal' },
  { title: 'Suitable for Vegetarians', detail: 'Vegetarian-friendly' },
  { title: 'Real and Authentic Taste', detail: 'True to tradition' },
]

export default function Home() {
  const [products, setProducts] = useState([])
  const [sections, setSections] = useState({})
  const [homeData, setHomeData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Fetch data from Laravel API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured products from API
        const productsResponse = await getProducts({ featured: true })
        if (productsResponse.success) {
          setProducts(productsResponse.data)
        }

        // Fetch site sections from API
        const sectionsResponse = await getSections()
        if (sectionsResponse.success) {
          const sectionsMap = {}
          sectionsResponse.data.forEach(section => {
            sectionsMap[section.section_key] = section
          })
          setSections(sectionsMap)
        }

        // Check for admin-saved home page data in localStorage
        const savedHomeData = localStorage.getItem('homePageData')
        if (savedHomeData) {
          setHomeData(JSON.parse(savedHomeData))
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Auto-rotate slider every 5 seconds
    const sliderInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3)
    }, 5000)

    return () => clearInterval(sliderInterval)
  }, [])

  // Get mixes from products or use default (or saved data)
  const mixes = homeData?.mixes || (products.length > 0 ? products.slice(0, 8).map(p => ({
    name: p.name,
    desc: p.short_description || 'Delicious product from Al-Riwaj',
    image: p.image || null
  })) : [
    { name: 'Cooking Sauces', desc: 'Delectable meals without the hassle', image:'/brand/nat.jpg' },
    { name: 'Recipe Mixes', desc: 'A taste of happiness in every bite', image: '/brand/Biryani.jpeg' },
    { name: 'Plain Spices', desc: 'Aroma and authentic flavor', image:'/brand/box.jpg' },
    { name: 'Cooking Paste', desc: 'Natural ingredients, full freshness', image:'/brand/' },
    { name: 'Accompaniments', desc: 'Pickles, relishes, chutneys', image: '/brand/' },
    { name: 'Desserts', desc: 'Contemporary and traditional delights', image: null },
    { name: 'Shoop', desc: 'Instant noodles range', image: null },
    { name: 'Salt', desc: 'Balanced taste for everyday meals', image: null },
  ])

  // Get about section content from API or use default
  const aboutContent = sections.about || {
    title: 'Know Us',
    content: 'Al-Riwaj brings the soul of Pakistani kitchens to tables around the world. Our blends are inspired by heritage recipes, refined with modern quality standards, and crafted to help you cook with confidence.'
  }

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-slide">
          {homeData?.heroType === 'video' ? (
            /* Video Background */
            <div className="hero-video-container">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="hero-video"
                poster={homeData?.videoPoster || '/brand/video-poster.jpg'}
              >
                <source src={homeData?.videoUrl || '/brand/intro.mp4'} type="video/mp4" />
              </video>
              <div className="hero-overlay"></div>
            </div>
          ) : (
            /* Image Slider */
            <div 
              className="hero-image" 
              style={homeData?.heroImages?.[currentSlide] ? 
                { backgroundImage: `url(${homeData.heroImages[currentSlide]})`, backgroundSize: 'cover', backgroundPosition: 'center' } : 
                {}
              }
            />
          )}
          <div className="container hero-content">
            <img className="hero-logo" src="/brand/logo.png" alt="Al-Riwaj" />
            <span className="hero-tag">{homeData?.heroTagline || 'Taste of Authentic Food with a Bite of Happiness'}</span>
            <h1>
              {homeData?.heroTitle || 'Al-Riwaj Foods'}
              <span className="hero-sub">{homeData?.heroSubtitle || 'Taste of authentic food with a bite of happiness'}</span>
            </h1>
            <Link to="/products" className="hero-btn">{homeData?.heroButton || 'Explore Products'}</Link>
          </div>
          {/* Slider Dots */}
          {homeData?.heroType !== 'video' && homeData?.heroImages?.[0] && (
            <>
              <div className="slider-dots">
                {[0, 1, 2].map((index) => (
                  <div 
                    key={index} 
                    className={`slider-dot ${currentSlide === index ? 'active' : ''}`}
                    onClick={() => setCurrentSlide(index)}
                  />
                ))}
              </div>
              <button 
                className="slider-arrow slider-prev" 
                onClick={() => setCurrentSlide((currentSlide - 1 + 3) % 3)}
                aria-label="Previous slide"
              >
                ‹
              </button>
              <button 
                className="slider-arrow slider-next" 
                onClick={() => setCurrentSlide((currentSlide + 1) % 3)}
                aria-label="Next slide"
              >
                ›
              </button>
            </>
          )}
          <a className="scroll-down" href="#mixes">
            View Down
          </a>
        </div>
      </section>

 

      <section id="mixes" className="mixes reveal">
        <div className="container mixes-header">
          <p className="eyebrow">Our</p>
          <h2 className="stacked-title">
            <span>Mixes</span>
          </h2>
        </div>
        <div className="container mixes-grid">
          {mixes.map((mix, index) => (
            <div key={mix.name} className="mix-card">
              <div 
                className={`mix-image mix-image-${index % 4}`} 
                style={mix.image ? { backgroundImage: `url(${mix.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
              />
              <div className="mix-body">
                <h3>{mix.name}</h3>
                <p>{mix.desc}</p>
                <Link to="/products" className="text-link">Explore Now</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="spotlight reveal" style={{ padding: '60px 0' }}>
        <div style={{ display: 'block', width: '100%', maxWidth: '100%' }}>
          <div style={{ maxWidth: '100%', margin: '0 auto', width: '100%', padding: '0' }}>
            <h3 style={{ textAlign: 'center', padding: '0 20px', color: '#d4a574', fontSize: '2.5rem', fontWeight: '600' }}>{homeData?.videoTitle || 'Al-Riwaj Introduction'}</h3>
            <p style={{ textAlign: 'center', padding: '0 20px' }}>{homeData?.videoDesc || 'Discover the Secret Behind Rich Taste and Premium Quality.'}</p>
            <div style={{ width: '100%', maxWidth: '100%', marginTop: '20px' }}>
              <video
                controls
                autoPlay
                muted
                loop
                playsInline
                poster={homeData?.videoPoster || '/brand/video-poster.jpg'}
                style={{ width: '100%', height: 'auto', maxHeight: '80vh', objectFit: 'contain', background: '#000' }}
              >
                <source src={homeData?.videoUrl || '/brand/intro.mp4'} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      <section className="cta reveal">
        <div className="container cta-grid">
          <div className="cta-card alt">
            <p className="eyebrow">Join our</p>
            <h3>Family</h3>
            <Link to="/careers" className="hero-btn">Apply Now</Link>
          </div>
          <div className="cta-card alt">
            <p className="eyebrow">Become our</p>
            <h3>Distribution Partner</h3>
            <Link to="/distributor" className="hero-btn">Apply Now</Link>
          </div>
        </div>
      </section>

      <section className="newsletter reveal">
        <div className="container newsletter-inner">
          <div>
            <p className="eyebrow">Newsletter</p>
            <h3>Subscription</h3>
          </div>
          <div className="newsletter-input">
            <input type="email" placeholder="Enter email address" />
            <button>Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  )
}
