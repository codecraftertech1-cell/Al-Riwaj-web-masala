import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

const sectionConfig = {
  home: {
    title: 'Home Page',
    description: 'Hero section, cards, video, and all home page content manage karein.',
  },
  about: {
    title: 'About',
    description: 'Company intro, mission, and brand story content manage karein.',
  },
  management: {
    title: 'Our Management',
    description: 'Leadership team profiles, designations, aur highlights update karein.',
  },
  products: {
    title: 'Products',
    description: 'Product page ke headings, banners, aur featured content manage karein.',
  },
  shop: {
    title: 'Shop',
    description: 'Shop page promotions, announcements, aur customer-facing notes control karein.',
  },
  media: {
    title: 'Media',
    description: 'Media updates, campaign highlights, aur coverage content handle karein.',
  },
  careers: {
    title: 'Careers',
    description: 'Hiring content, openings intro text, aur application instructions update karein.',
  },
  contact: {
    title: 'Contact Us',
    description: 'Contact details, support info, aur help text admin panel se manage karein.',
  },
}

const activitySeed = [
  { action: 'Content updated', by: 'Admin', time: '11:30 AM' },
  { action: 'Banner draft saved', by: 'Editor', time: '10:05 AM' },
  { action: 'Status changed to Published', by: 'Admin', time: '09:20 AM' },
]

export default function ManageSiteSection() {
  const { section } = useParams()
  const current = sectionConfig[section] ?? sectionConfig.about
  const [headline, setHeadline] = useState(`${current.title} Page Heading`)
  const [summary, setSummary] = useState(current.description)
  const [status, setStatus] = useState('Published')

  // Home page specific state
  const [heroTitle, setHeroTitle] = useState('Al-Riwaj Foods')
  const [heroSubtitle, setHeroSubtitle] = useState('Taste of authentic food with a bite of happiness')
  const [heroTagline, setHeroTagline] = useState('Taste of Authentic Food with a Bite of Happiness')
  const [heroButton, setHeroButton] = useState('Explore Products')
  const [heroType, setHeroType] = useState('slider') // 'slider' or 'video'
  const [heroImages, setHeroImages] = useState(['', '', ''])
  const [videoTitle, setVideoTitle] = useState('Al-Riwaj Introduction')
  const [videoDesc, setVideoDesc] = useState('Discover the Secret Behind Rich Taste and Premium Quality.')
  const [videoUrl, setVideoUrl] = useState('/brand/intro.mp4')
  const [videoPoster, setVideoPoster] = useState('/brand/video-poster.jpg')
  const [aboutStory, setAboutStory] = useState('From a small kitchen tradition to a global pantry essential, Al-Riwaj has always focused on authenticity, consistency, and trust.')
  const [aboutStoryImage, setAboutStoryImage] = useState('/brand/about.png')
  const [aboutPurpose, setAboutPurpose] = useState('To preserve the taste of home while making cooking effortless and joyful for families everywhere.')
  const [aboutPurposeImage, setAboutPurposeImage] = useState('/brand/about.jpg')
  const [mixes, setMixes] = useState([
    { name: 'Cooking Sauces', desc: 'Delectable meals without the hassle', image: '/brand/nat.jpg' },
    { name: 'Recipe Mixes', desc: 'A taste of happiness in every bite', image: '/brand/Biryani.jpeg' },
    { name: 'Plain Spices', desc: 'Aroma and authentic flavor', image: '/brand/box.jpg' },
    { name: 'Cooking Paste', desc: 'Natural ingredients, full freshness', image: '' },
    { name: 'Accompaniments', desc: 'Pickles, relishes, chutneys', image: '' },
    { name: 'Desserts', desc: 'Contemporary and traditional delights', image: '' },
    { name: 'Shoop', desc: 'Instant noodles range', image: '' },
    { name: 'Salt', desc: 'Balanced taste for everyday meals', image: '' },
  ])

  const statusClass = useMemo(() => status.toLowerCase().replace(/\s+/g, '-'), [status])

  const handleMixChange = (index, field, value) => {
    const updatedMixes = [...mixes]
    updatedMixes[index][field] = value
    setMixes(updatedMixes)
  }

  const isHome = section === 'home'
  const isAbout = section === 'about'

  const handleSave = () => {
    if (isHome) {
      const homeData = {
        heroTitle,
        heroSubtitle,
        heroTagline,
        heroButton,
        heroType,
        heroImages,
        videoTitle,
        videoDesc,
        videoUrl,
        videoPoster,
        mixes,
        status
      }
      localStorage.setItem('homePageData', JSON.stringify(homeData))
      alert('Home page content saved! Changes will appear on the live site.')
    } else if (section === 'about') {
      const aboutData = {
        aboutStory,
        aboutStoryImage,
        aboutPurpose,
        aboutPurposeImage
      }
      const existingData = JSON.parse(localStorage.getItem('homePageData') || '{}')
      localStorage.setItem('homePageData', JSON.stringify({ ...existingData, ...aboutData }))
      alert('About page content saved! Changes will appear on the live site.')
    } else {
      alert('Content saved successfully!')
    }
  }

  return (
    <div className="page inner">
      <section className="inner-hero">
        <div className="container">
          <p className="eyebrow">Admin Content Manager</p>
          <h1>{current.title}</h1>
          <p className="lead">{current.description}</p>
        </div>
      </section>

      <section className="inner-section">
        <div className="container manage-section-grid">
          {isHome ? (
            // Home Page Management Form
            <form className="card admin-form reveal">
              <h3>Edit Home Page</h3>
              
              {/* Hero Section */}
              <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
                <h4 style={{ marginBottom: '1rem' }}>Hero Section</h4>
                
                {/* Hero Type Selection */}
                <label>
                  Content Type
                  <select value={heroType} onChange={(e) => setHeroType(e.target.value)}>
                    <option value="slider">Image Slider (3 Images)</option>
                    <option value="video">Video</option>
                  </select>
                </label>

                {heroType === 'slider' ? (
                  /* Slider Images */
                  <div style={{ marginTop: '1rem' }}>
                    <h5 style={{ marginBottom: '0.5rem' }}>Slider Images (3 images)</h5>
                    {[0, 1, 2].map((index) => (
                      <label key={index} style={{ marginBottom: '1rem', display: 'block' }}>
                        Image {index + 1}
                        <input 
                          type="text" 
                          value={heroImages[index]} 
                          onChange={(e) => {
                            const newImages = [...heroImages]
                            newImages[index] = e.target.value
                            setHeroImages(newImages)
                          }} 
                          placeholder="/brand/..." 
                        />
                        <input 
                          type="file" 
                          accept="image/*" 
                          style={{ marginTop: '0.5rem' }}
                          onChange={(e) => {
                            const file = e.target.files[0]
                            if (file) {
                              const objectUrl = URL.createObjectURL(file)
                              const newImages = [...heroImages]
                              newImages[index] = objectUrl
                              setHeroImages(newImages)
                            }
                          }} 
                        />
                      </label>
                    ))}
                  </div>
                ) : (
                  /* Video Section */
                  <div style={{ marginTop: '1rem' }}>
                    <label>
                      Video URL
                      <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
                    </label>
                    <label style={{ marginTop: '0.5rem' }}>
                      Or Upload Video from Computer
                      <input type="file" accept="video/*" onChange={(e) => {
                        const file = e.target.files[0]
                        if (file) {
                          const objectUrl = URL.createObjectURL(file)
                          setVideoUrl(objectUrl)
                        }
                      }} />
                    </label>
                    <label style={{ marginTop: '1rem' }}>
                      Video Poster Image
                      <input type="text" value={videoPoster} onChange={(e) => setVideoPoster(e.target.value)} />
                    </label>
                    <label style={{ marginTop: '0.5rem' }}>
                      Or Upload Poster from Computer
                      <input type="file" accept="image/*" onChange={(e) => {
                        const file = e.target.files[0]
                        if (file) {
                          const objectUrl = URL.createObjectURL(file)
                          setVideoPoster(objectUrl)
                        }
                      }} />
                    </label>
                  </div>
                )}
                
                <label style={{ marginTop: '1rem' }}>
                  Main Title
                  <input type="text" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} />
                </label>
                <label>
                  Subtitle
                  <input type="text" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} />
                </label>
                <label>
                  Tagline
                  <input type="text" value={heroTagline} onChange={(e) => setHeroTagline(e.target.value)} />
                </label>
                <label>
                  Button Text
                  <input type="text" value={heroButton} onChange={(e) => setHeroButton(e.target.value)} />
                </label>
              </div>

              {/* Video Section */}
              <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
                <h4 style={{ marginBottom: '1rem' }}>Video Section</h4>
                <label>
                  Video Title
                  <input type="text" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} />
                </label>
                <label>
                  Video Description
                  <textarea rows="2" value={videoDesc} onChange={(e) => setVideoDesc(e.target.value)} />
                </label>
                <label>
                  Video URL
                  <input type="text" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
                </label>
                <label style={{ marginTop: '0.5rem' }}>
                  Or Upload Video from Computer
                  <input type="file" accept="video/*" onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const objectUrl = URL.createObjectURL(file)
                      setVideoUrl(objectUrl)
                    }
                  }} />
                </label>
                <label style={{ marginTop: '1rem' }}>
                  Video Poster Image
                  <input type="text" value={videoPoster} onChange={(e) => setVideoPoster(e.target.value)} />
                </label>
                <label style={{ marginTop: '0.5rem' }}>
                  Or Upload Poster from Computer
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const objectUrl = URL.createObjectURL(file)
                      setVideoPoster(objectUrl)
                    }
                  }} />
                </label>
              </div>

              {/* Cards/Mixes Section */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 style={{ marginBottom: '1rem' }}>Cards / Mixes ({mixes.length} items)</h4>
                {mixes.map((mix, index) => (
                  <div key={index} style={{ marginBottom: '1rem', padding: '1rem', background: '#fafafa', borderRadius: '8px', border: '1px solid #eee' }}>
                    <h5 style={{ marginBottom: '0.5rem' }}>Card {index + 1}</h5>
                    <label>
                      Name
                      <input type="text" value={mix.name} onChange={(e) => handleMixChange(index, 'name', e.target.value)} />
                    </label>
                    <label>
                      Description
                      <input type="text" value={mix.desc} onChange={(e) => handleMixChange(index, 'desc', e.target.value)} />
                    </label>
                    <label>
                      Image URL
                      <input type="text" value={mix.image} onChange={(e) => handleMixChange(index, 'image', e.target.value)} placeholder="/brand/..." />
                    </label>
                    <label style={{ marginTop: '0.5rem' }}>
                      Or Upload from Computer
                      <input type="file" accept="image/*" onChange={(e) => {
                        const file = e.target.files[0]
                        if (file) {
                          const objectUrl = URL.createObjectURL(file)
                          handleMixChange(index, 'image', objectUrl)
                        }
                      }} />
                    </label>
                  </div>
                ))}
              </div>

              <label>
                Publish Status
                <select value={status} onChange={(event) => setStatus(event.target.value)}>
                  <option>Published</option>
                  <option>Draft</option>
                  <option>Under Review</option>
                </select>
              </label>
              <button type="button" className="hero-btn" onClick={handleSave}>Save All Changes</button>
            </form>
          ) : (
            // Other Pages Management Form
            <form className="card admin-form reveal">
            <h3>Edit {current.title} Page</h3>
            <label>
              Page Headline
              <input
                type="text"
                value={headline}
                onChange={(event) => setHeadline(event.target.value)}
              />
            </label>
            <label>
              Page Description
              <textarea
                rows="5"
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
              />
            </label>
            <label>
              Publish Status
              <select value={status} onChange={(event) => setStatus(event.target.value)}>
                <option>Published</option>
                <option>Draft</option>
                <option>Under Review</option>
              </select>
            </label>
            <button type="button" className="hero-btn">Save Changes</button>
          </form>
          )}

          {isAbout && (
            <form className="card admin-form reveal">
              <h3>Edit About Page</h3>
              
              {/* Our Story */}
              <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
                <h4 style={{ marginBottom: '1rem' }}>Our Story Card</h4>
                <label>
                  Story Text
                  <textarea
                    rows="4"
                    value={aboutStory}
                    onChange={(e) => setAboutStory(e.target.value)}
                    placeholder="Enter your story text..."
                  />
                </label>
                <label style={{ marginTop: '1rem' }}>
                  Image URL
                  <input type="text" value={aboutStoryImage} onChange={(e) => setAboutStoryImage(e.target.value)} placeholder="/brand/..." />
                </label>
                <label style={{ marginTop: '0.5rem' }}>
                  Or Upload Image
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const objectUrl = URL.createObjectURL(file)
                      setAboutStoryImage(objectUrl)
                    }
                  }} />
                </label>
              </div>

              {/* Our Purpose */}
              <div style={{ marginBottom: '2rem', padding: '1rem', background: '#f5f5f5', borderRadius: '8px' }}>
                <h4 style={{ marginBottom: '1rem' }}>Our Purpose Card</h4>
                <label>
                  Purpose Text
                  <textarea
                    rows="4"
                    value={aboutPurpose}
                    onChange={(e) => setAboutPurpose(e.target.value)}
                    placeholder="Enter your purpose text..."
                  />
                </label>
                <label style={{ marginTop: '1rem' }}>
                  Image URL
                  <input type="text" value={aboutPurposeImage} onChange={(e) => setAboutPurposeImage(e.target.value)} placeholder="/brand/..." />
                </label>
                <label style={{ marginTop: '0.5rem' }}>
                  Or Upload Image
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files[0]
                    if (file) {
                      const objectUrl = URL.createObjectURL(file)
                      setAboutPurposeImage(objectUrl)
                    }
                  }} />
                </label>
              </div>

              <button type="button" className="hero-btn" onClick={handleSave}>Save Changes</button>
            </form>
          )}

          <div className="dashboard-main">
            <div className="card reveal">
              <h3>Live Preview Data</h3>
              {isHome ? (
                <>
                  <p><strong>Hero Title:</strong> {heroTitle}</p>
                  <p><strong>Hero Subtitle:</strong> {heroSubtitle}</p>
                  <p><strong>Tagline:</strong> {heroTagline}</p>
                  <p><strong>Button:</strong> {heroButton}</p>
                  <p><strong>Video Title:</strong> {videoTitle}</p>
                  <p><strong>Video URL:</strong> {videoUrl}</p>
                  <p><strong>Cards:</strong> {mixes.length} items</p>
                </>
              ) : (
                <>
                  <p><strong>Headline:</strong> {headline}</p>
                  <p><strong>Description:</strong> {summary}</p>
                </>
              )}
              <p>
                <strong>Status:</strong>{' '}
                <span className={`status-pill ${statusClass}`}>{status}</span>
              </p>
            </div>

            <div className="card reveal">
              <h3>{current.title} Activity</h3>
              <div className="table-wrap">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>By</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activitySeed.map((item) => (
                      <tr key={`${item.action}-${item.time}`}>
                        <td>{item.action}</td>
                        <td>{item.by}</td>
                        <td>{item.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
