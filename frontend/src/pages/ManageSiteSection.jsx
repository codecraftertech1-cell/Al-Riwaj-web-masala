import { useMemo, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getMedia, createMedia, updateMedia, deleteMedia, uploadImage } from '../services/api'

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
  const isMedia = section === 'media'

  // Media state
  const [mediaItems, setMediaItems] = useState([])
  const [mediaLoading, setMediaLoading] = useState(true)
  const [newCaption, setNewCaption] = useState('')
  const [newCategory, setNewCategory] = useState('news')
  const [selectedFile, setSelectedFile] = useState(null)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    if (isMedia) {
      fetchMedia()
    }
  }, [isMedia])

  const fetchMedia = async () => {
    try {
      const response = await getMedia()
      if (response.success) {
        setMediaItems(response.data)
      }
    } catch (err) {
      console.error('Error fetching media:', err)
    } finally {
      setMediaLoading(false)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !newCaption) {
      alert('Please select an image and enter a caption')
      return
    }

    try {
      // First upload the file
      const uploadResponse = await uploadImage(selectedFile)
      
      if (uploadResponse.success) {
        // Then create the media record
        const mediaData = {
          file_name: uploadResponse.data.file_name,
          original_name: uploadResponse.data.original_name,
          mime_type: uploadResponse.data.mime_type,
          file_path: uploadResponse.data.file_path,
          file_size: uploadResponse.data.file_size,
          caption: newCaption,
          category: newCategory,
          is_active: true
        }

        const createResponse = await createMedia(mediaData)
        
        if (createResponse.success) {
          alert('Media added successfully!')
          setNewCaption('')
          setSelectedFile(null)
          fetchMedia()
        }
      }
    } catch (err) {
      console.error('Error uploading media:', err)
      alert('Failed to upload media')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this media?')) return

    try {
      const response = await deleteMedia(id)
      if (response.success) {
        alert('Media deleted successfully!')
        fetchMedia()
      }
    } catch (err) {
      console.error('Error deleting media:', err)
      alert('Failed to delete media')
    }
  }

  const handleToggleActive = async (id, currentStatus) => {
    try {
      const response = await updateMedia(id, { is_active: !currentStatus })
      if (response.success) {
        fetchMedia()
      }
    } catch (err) {
      console.error('Error updating media:', err)
    }
  }

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

  // Save only Hero/Slider/Video section
  const handleSaveHero = () => {
    const heroData = {
      heroTitle,
      heroSubtitle,
      heroTagline,
      heroButton,
      heroType,
      heroImages,
      videoTitle,
      videoDesc,
      videoUrl,
      videoPoster
    }
    const existingData = JSON.parse(localStorage.getItem('homePageData') || '{}')
    localStorage.setItem('homePageData', JSON.stringify({ ...existingData, ...heroData }))
    alert('Hero section saved!')
  }

  // Save only Cards/Mixes section
  const handleSaveMixes = () => {
    const mixesData = { mixes }
    const existingData = JSON.parse(localStorage.getItem('homePageData') || '{}')
    localStorage.setItem('homePageData', JSON.stringify({ ...existingData, ...mixesData }))
    alert('Cards/Mixes section saved!')
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
          {isMedia ? (
            // Media Management
            <div className="card admin-form reveal" style={{ width: '100%' }}>
              <h3>Add New Media</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <label>
                  Caption/Title
                  <input
                    type="text"
                    value={newCaption}
                    onChange={(e) => setNewCaption(e.target.value)}
                    placeholder="Enter caption..."
                  />
                </label>
                <label>
                  Category
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                    <option value="news">News</option>
                    <option value="campaign">Campaign</option>
                    <option value="event">Event</option>
                    <option value="announcement">Announcement</option>
                  </select>
                </label>
              </div>
              <label>
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                />
              </label>
              {selectedFile && (
                <div style={{ margin: '1rem 0' }}>
                  <img src={URL.createObjectURL(selectedFile)} alt="Preview" style={{ maxWidth: '200px', borderRadius: '8px' }} />
                </div>
              )}
              <button type="button" className="hero-btn" onClick={handleUpload} style={{ marginTop: '1rem' }}>
                Add Media
              </button>

              <h3 style={{ marginTop: '2rem' }}>Existing Media ({mediaItems.length})</h3>
              {mediaLoading ? (
                <p>Loading media...</p>
              ) : mediaItems.length === 0 ? (
                <p>No media found. Add your first media item above.</p>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                  {mediaItems.map((item) => (
                    <div key={item.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '1rem', background: '#fafafa' }}>
                      <img src={item.file_path} alt={item.caption} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px' }} />
                      <h4 style={{ marginTop: '0.5rem', fontSize: '1rem' }}>{item.caption}</h4>
                      <p style={{ fontSize: '0.8rem', color: '#666' }}>{item.category}</p>
                      <p style={{ fontSize: '0.75rem', color: '#888' }}>{item.created_at}</p>
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(item.id, item.is_active)}
                          style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', background: item.is_active ? '#2ecc71' : '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          {item.is_active ? 'Active' : 'Inactive'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          style={{ padding: '0.3rem 0.8rem', fontSize: '0.8rem', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : isHome ? (
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
                          onChange={async (e) => {
                            const file = e.target.files[0]
                            if (file) {
                              try {
                                // Upload to Laravel backend
                                const response = await uploadImage(file)
                                if (response.success && response.path) {
                                  const newImages = [...heroImages]
                                  newImages[index] = '/' + response.path
                                  setHeroImages(newImages)
                                }
                              } catch (error) {
                                console.error('Upload failed:', error)
                                // Fallback to blob URL if upload fails
                                const objectUrl = URL.createObjectURL(file)
                                const newImages = [...heroImages]
                                newImages[index] = objectUrl
                                setHeroImages(newImages)
                              }
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
                      <input type="file" accept="video/*" onChange={async (e) => {
                        const file = e.target.files[0]
                        if (file) {
                          try {
                            const formData = new FormData()
                            formData.append('file', file)
                            // Upload to backend
                            const response = await uploadImage(file)
                            if (response.success && response.path) {
                              setVideoUrl('/' + response.path)
                            }
                          } catch (error) {
                            console.error('Video upload failed:', error)
                            const objectUrl = URL.createObjectURL(file)
                            setVideoUrl(objectUrl)
                          }
                        }
                      }} />
                    </label>
                    <label style={{ marginTop: '1rem' }}>
                      Video Poster Image
                      <input type="text" value={videoPoster} onChange={(e) => setVideoPoster(e.target.value)} />
                    </label>
                    <label style={{ marginTop: '0.5rem' }}>
                      Or Upload Poster from Computer
                      <input type="file" accept="image/*" onChange={async (e) => {
                        const file = e.target.files[0]
                        if (file) {
                          try {
                            const response = await uploadImage(file)
                            if (response.success && response.path) {
                              setVideoPoster('/' + response.path)
                            }
                          } catch (error) {
                            console.error('Poster upload failed:', error)
                            const objectUrl = URL.createObjectURL(file)
                            setVideoPoster(objectUrl)
                          }
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
                
                <button 
                  type="button" 
                  className="hero-btn" 
                  onClick={handleSaveHero}
                  style={{ marginTop: '1rem', marginRight: '10px' }}
                >
                  Save Hero Section
                </button>
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
                  <input type="file" accept="video/*" onChange={async (e) => {
                    const file = e.target.files[0]
                    if (file) {
                      try {
                        const formData = new FormData()
                        formData.append('file', file)
                        // Upload to backend
                        const response = await uploadImage(file)
                        if (response.success && response.path) {
                          setVideoUrl('/' + response.path)
                        }
                      } catch (error) {
                        console.error('Video upload failed:', error)
                        const objectUrl = URL.createObjectURL(file)
                        setVideoUrl(objectUrl)
                      }
                    }
                  }} />
                </label>
                <label style={{ marginTop: '1rem' }}>
                  Video Poster Image
                  <input type="text" value={videoPoster} onChange={(e) => setVideoPoster(e.target.value)} />
                </label>
                <label style={{ marginTop: '0.5rem' }}>
                  Or Upload Poster from Computer
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files[0]
                    if (file) {
                      try {
                        const response = await uploadImage(file)
                        if (response.success && response.path) {
                          setVideoPoster('/' + response.path)
                        }
                      } catch (error) {
                        console.error('Poster upload failed:', error)
                        const objectUrl = URL.createObjectURL(file)
                        setVideoPoster(objectUrl)
                      }
                    }
                  }} />
                </label>
                
                <button 
                  type="button" 
                  className="hero-btn" 
                  onClick={handleSaveHero}
                  style={{ marginTop: '1rem', marginRight: '10px' }}
                >
                  Save Video Section
                </button>
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
                      <input type="file" accept="image/*" onChange={async (e) => {
                        const file = e.target.files[0]
                        if (file) {
                          try {
                            const response = await uploadImage(file)
                            if (response.success && response.path) {
                              handleMixChange(index, 'image', '/' + response.path)
                            }
                          } catch (error) {
                            console.error('Upload failed:', error)
                            const objectUrl = URL.createObjectURL(file)
                            handleMixChange(index, 'image', objectUrl)
                          }
                        }
                      }} />
                    </label>
                  </div>
                ))}
              </div>

              <button 
                type="button" 
                className="hero-btn" 
                onClick={handleSaveMixes}
                style={{ marginBottom: '1rem' }}
              >
                Save Cards / Mixes
              </button>

              <label>
                Publish Status
                <select value={status} onChange={(event) => setStatus(event.target.value)}>
                  <option>Published</option>
                  <option>Draft</option>
                  <option>Under Review</option>
                </select>
              </label>
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
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files[0]
                    if (file) {
                      try {
                        const response = await uploadImage(file)
                        if (response.success && response.path) {
                          setAboutStoryImage('/' + response.path)
                        }
                      } catch (error) {
                        console.error('Upload failed:', error)
                        const objectUrl = URL.createObjectURL(file)
                        setAboutStoryImage(objectUrl)
                      }
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
                  <input type="file" accept="image/*" onChange={async (e) => {
                    const file = e.target.files[0]
                    if (file) {
                      try {
                        const response = await uploadImage(file)
                        if (response.success && response.path) {
                          setAboutPurposeImage('/' + response.path)
                        }
                      } catch (error) {
                        console.error('Upload failed:', error)
                        const objectUrl = URL.createObjectURL(file)
                        setAboutPurposeImage(objectUrl)
                      }
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
