import { useState, useEffect } from 'react'
import { getSectionsAdmin, updateSection, updateSectionByKey, uploadImage } from '../services/api'

export default function ManageLeadership() {
  const [sections, setSections] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingSection, setEditingSection] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    key: ''
  })
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploading, setUploading] = useState(false)

  const leadershipSections = [
    { key: 'founder', title: 'Our Founder', defaultImage: '/brand/about.png' },
    { key: 'board', title: 'Board of Directors', defaultImage: '/brand/about.png' },
    { key: 'ceo', title: 'Meet The CEO', defaultImage: '/brand/about.png' },
    { key: 'committee', title: 'Managing Committee', defaultImage: '/brand/about.png' }
  ]

  // Fetch sections
  const fetchSections = async () => {
    try {
      const response = await getSectionsAdmin()
      if (response.success) {
        setSections(response.data)
      }
    } catch (err) {
      console.error('Error fetching sections:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSections()
  }, [])

  const getSectionData = (key) => {
    return sections.find(s => s.section_key === key) || null
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleEdit = (sectionKey) => {
    const section = getSectionData(sectionKey)
    const sectionInfo = leadershipSections.find(s => s.key === sectionKey)
    
    setEditingSection(sectionKey)
    setFormData({
      title: section?.title || sectionInfo?.title || '',
      content: section?.content || '',
      key: sectionKey
    })
    setSelectedFile(null)
    setShowModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      let imagePath = null

      // Upload image if selected
      if (selectedFile) {
        setUploading(true)
        const uploadRes = await uploadImage(selectedFile)
        if (uploadRes.success) {
          imagePath = uploadRes.data.file_path
        } else {
          setError('Failed to upload image')
          setUploading(false)
          return
        }
        setUploading(false)
      }

      const data = {
        title: formData.title,
        content: formData.content
      }

      // Only include image if a new one was uploaded
      if (imagePath) {
        data.image = imagePath
      }

      const response = await updateSectionByKey(editingSection, data)

      if (response.success) {
        setSuccess('Leadership page updated successfully')
        setShowModal(false)
        fetchSections()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(response.message || 'Failed to update')
      }
    } catch (err) {
      console.error('Error saving:', err)
      setError('Error saving data')
    }
  }

  return (
    <div className="page inner dashboard-page">
      <section className="inner-hero">
        <div className="container">
          <p className="eyebrow">Content Management</p>
          <h1>Manage Leadership</h1>
          <p className="lead">
            Update leadership pages content and images.
          </p>
        </div>
      </section>

      <section className="inner-section">
        <div className="container">
          {success && (
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#d4edda', borderColor: '#c3e6cb', color: '#155724', borderRadius: '4px' }}>
              {success}
            </div>
          )}
          {error && (
            <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8d7da', borderColor: '#f5c6cb', color: '#721c24', borderRadius: '4px' }}>
              {error}
            </div>
          )}

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: '24px' 
            }}>
              {leadershipSections.map((section) => {
                const sectionData = getSectionData(section.key)
                return (
                  <div 
                    key={section.key} 
                    className="card reveal"
                    style={{ 
                      padding: '20px',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                    }}
                  >
                    <img 
                      src={sectionData?.image ? (sectionData.image.startsWith('/') ? sectionData.image : '/' + sectionData.image) : section.defaultImage} 
                      alt={section.title}
                      style={{ 
                        width: '100%', 
                        height: '200px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        marginBottom: '15px'
                      }}
                    />
                    <h3 style={{ marginBottom: '10px' }}>{sectionData?.title || section.title}</h3>
                    <p style={{ color: '#666', marginBottom: '15px', fontSize: '14px' }}>
                      {sectionData?.content ? sectionData.content.substring(0, 100) + '...' : 'No content yet'}
                    </p>
                    <button 
                      onClick={() => handleEdit(section.key)}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#d4a574',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px'
                      }}
                    >
                      Edit Page
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Modal */}
      {showModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowModal(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              padding: '30px',
              borderRadius: '8px',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: '20px' }}>
              Edit {formData.title}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Change Image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
                <p style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                  Image will be stored in Laravel public folder
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Content
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Enter page content (HTML supported)"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#d4a574',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    opacity: uploading ? 0.7 : 1
                  }}
                >
                  {uploading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
