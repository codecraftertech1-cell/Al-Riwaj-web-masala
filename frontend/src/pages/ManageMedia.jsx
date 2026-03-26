import { useState, useEffect } from 'react'
import { getMedia, createMedia, updateMedia, deleteMedia } from '../services/api'

export default function ManageMedia() {
  const [mediaItems, setMediaItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    caption: '',
    category: '',
    alt_text: '',
    display_date: ''
  })

  // Fetch media items
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

  useEffect(() => {
    fetchMedia()
  }, [])

  // Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Open modal for new item
  const handleAddNew = () => {
    setEditingItem(null)
    setFormData({
      caption: '',
      category: '',
      alt_text: '',
      display_date: new Date().toISOString().split('T')[0]
    })
    setShowModal(true)
  }

  // Open modal for editing
  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      caption: item.caption || '',
      category: item.category || '',
      alt_text: item.alt_text || '',
      display_date: item.created_at ? item.created_at.split('T')[0] : ''
    })
    setShowModal(true)
  }

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this media item?')) {
      return
    }

    try {
      const response = await deleteMedia(id)
      if (response.success) {
        setSuccess('Media item deleted successfully')
        setMediaItems(prev => prev.filter(item => item.id !== id))
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError('Failed to delete media')
      }
    } catch (err) {
      console.error('Error deleting media:', err)
      setError('Error deleting media')
    }
  }

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      let data = {
        caption: formData.caption,
        category: formData.category,
        alt_text: formData.alt_text,
        is_active: true
      }

      // Add custom date if provided
      if (formData.display_date) {
        data.created_at = new Date(formData.display_date).toISOString()
      }

      let response
      if (editingItem) {
        response = await updateMedia(editingItem.id, data)
      } else {
        // For create - use placeholder values since no image
        data = {
          ...data,
          file_name: 'placeholder.jpg',
          original_name: 'placeholder.jpg',
          mime_type: 'image/jpeg',
          file_path: '',
          file_size: '0'
        }
        response = await createMedia(data)
      }

      if (response.success) {
        setSuccess(editingItem ? 'Media updated successfully' : 'Media created successfully')
        setShowModal(false)
        fetchMedia()
        setTimeout(() => setSuccess(''), 3000)
      } else {
        setError(response.message || 'Failed to save media')
      }
    } catch (err) {
      console.error('Error saving media:', err)
      setError('Error saving media')
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
  }

  return (
    <div className="page inner dashboard-page">
      <section className="inner-hero">
        <div className="container">
          <p className="eyebrow">Media Management</p>
          <h1>Manage Media</h1>
          <p className="lead">
            Add, edit, or remove media items for your website's media page.
          </p>
        </div>
      </section>

      <section className="inner-section">
        <div className="container">
          {/* Success/Error Messages */}
          {success && (
            <div className="alert alert-success" style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#d4edda', borderColor: '#c3e6cb', color: '#155724', borderRadius: '4px' }}>
              {success}
            </div>
          )}
          {error && (
            <div className="alert alert-error" style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8d7da', borderColor: '#f5c6cb', color: '#721c24', borderRadius: '4px' }}>
              {error}
            </div>
          )}

          {/* Add New Button */}
          <div style={{ marginBottom: '30px' }}>
            <button 
              onClick={handleAddNew}
              style={{
                padding: '12px 24px',
                backgroundColor: '#d4a574',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              + Add New Media
            </button>
          </div>

          {/* Media List - with separator lines */}
          {loading ? (
            <p>Loading media...</p>
          ) : mediaItems.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <p>No media items found. Add your first media item!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {mediaItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className="reveal" 
                  style={{ 
                    padding: '30px 0',
                    borderBottom: index < mediaItems.length - 1 ? '3px solid #D4AF37' : 'none'
                  }}
                >
                  {/* Heading - White color */}
                  <h3 style={{ 
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#ffffff',
                    marginBottom: '10px'
                  }}>
                    {item.caption || 'Untitled'}
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
                    {formatDate(item.created_at)}
                  </span>
                  
                  {/* Description */}
                  <p style={{ color: '#ffffff', lineHeight: '1.7', fontSize: '16px', maxWidth: '800px', marginBottom: '20px' }}>
                    {item.alt_text || 'No description'}
                  </p>
                  
                  {/* Action Buttons - White background */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button 
                      onClick={() => handleEdit(item)}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#ffffff',
                        color: '#1a1a1a',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      style={{
                        padding: '10px 20px',
                        backgroundColor: '#ffffff',
                        color: '#dc3545',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
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
              maxWidth: '500px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: '20px' }}>
              {editingItem ? 'Edit Media' : 'Add New Media'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              {/* Caption */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Heading *
                </label>
                <input
                  type="text"
                  name="caption"
                  value={formData.caption}
                  onChange={handleChange}
                  required
                  placeholder="Enter heading/title"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                />
              </div>

              {/* Date */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Date
                </label>
                <input
                  type="date"
                  name="display_date"
                  value={formData.display_date}
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

              {/* Category */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    fontSize: '14px'
                  }}
                >
                  <option value="">Select Category</option>
                  <option value="news">News</option>
                  <option value="announcement">Announcement</option>
                  <option value="campaign">Campaign</option>
                  <option value="story">Story</option>
                  <option value="event">Event</option>
                </select>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Description
                </label>
                <textarea
                  name="alt_text"
                  value={formData.alt_text}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Enter description text"
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

              {/* Buttons */}
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
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
