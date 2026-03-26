import { useMemo, useState, useEffect } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct, getCategories, uploadImage } from '../services/api'

const emptyForm = {
  name: '',
  category: '',
  price: '',
  stock: '',
  description: '',
  short_description: '',
  sku: '',
  is_featured: false,
  is_active: true,
  image: '',
}

export default function AddProduct() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [uploading, setUploading] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')

  const isEditing = useMemo(() => editingId !== null, [editingId])

  // Fetch products and categories from API on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          getProducts(),
          getCategories()
        ])
        
        if (productsRes.success) {
          setProducts(productsRes.data)
        }
        
        if (categoriesRes.success) {
          setCategories(categoriesRes.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        showMessage('error', 'Failed to load data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: '', text: '' }), 3000)
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
  }

  function resetForm() {
    setFormData(emptyForm)
    setEditingId(null)
    setSelectedImage(null)
    setImagePreview('')
  }

  // Handle image selection
  function handleImageChange(event) {
    const file = event.target.files[0]
    if (file) {
      setSelectedImage(file)
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Upload image and get URL
  async function uploadProductImage(file) {
    try {
      setUploading(true)
      console.log('Starting upload for file:', file.name)
      const response = await uploadImage(file)
      console.log('Upload response:', response)
      if (response.success) {
        console.log('Uploaded file path:', response.data.file_path)
        // Also show in preview
        setImagePreview(`/${response.data.file_path}`)
        return response.data.file_path
      } else {
        console.error('Upload failed:', response.message)
        alert('Image upload failed: ' + (response.message || 'Unknown error'))
        return null
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      alert('Image upload error: ' + error.message)
      showMessage('error', 'Failed to upload image')
      return null
    } finally {
      setUploading(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!formData.name || !formData.category) {
      showMessage('error', 'Please fill in required fields')
      return
    }

    setSaving(true)
    try {
      // Upload image if a new file is selected
      let imagePath = formData.image || null
      let imageUpdated = false
      
      if (selectedImage) {
        console.log('Uploading new image...')
        const uploadedPath = await uploadProductImage(selectedImage)
        if (uploadedPath) {
          imagePath = uploadedPath
          imageUpdated = true
          console.log('New image uploaded:', imagePath)
        }
      } else if (formData.image === '') {
        // User explicitly removed the image
        imagePath = null
        console.log('Image explicitly removed')
      } else {
        console.log('Keeping existing image:', formData.image)
        imagePath = formData.image
      }

      const productData = {
        name: formData.name,
        category: formData.category,
        price: formData.price ? parseFloat(formData.price) : 0,
        stock_quantity: parseInt(formData.stock) || 0,
        short_description: formData.short_description || null,
        description: formData.description || null,
        sku: formData.sku || null,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
        sort_order: 0,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        image: imagePath,
      }

      console.log('Sending product data with image:', imagePath)

      let response
      if (isEditing) {
        console.log('Updating product ID:', editingId)
        response = await updateProduct(editingId, productData)
      } else {
        response = await createProduct(productData)
      }

      console.log('Save response:', response)

      if (response.success) {
        let successMsg = isEditing ? 'Product updated successfully' : 'Product created successfully'
        if (imageUpdated) {
          successMsg += ' ✓ Image uploaded!'
        }
        showMessage('success', successMsg)
        console.log('Product saved, image path:', imagePath)
        
        // Refresh products list
        const productsRes = await getProducts()
        if (productsRes.success) {
          setProducts(productsRes.data)
        }
        
        resetForm()
      }
    } catch (error) {
      console.error('Error saving product:', error)
      showMessage('error', error.message || 'Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  function handleEdit(product) {
    setEditingId(product.id)
    setFormData({
      name: product.name || '',
      category: product.category || '',
      price: product.price || '',
      stock: product.stock_quantity || '',
      description: product.description || '',
      short_description: product.short_description || '',
      sku: product.sku || '',
      is_featured: product.is_featured || false,
      is_active: product.is_active !== false,
      image: product.image || '',
    })
    // Set existing image preview
    if (product.image) {
      setImagePreview(product.image)
      setSelectedImage(null)
    } else {
      setImagePreview('')
      setSelectedImage(null)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      const response = await deleteProduct(id)
      if (response.success) {
        showMessage('success', 'Product deleted successfully')
        setProducts(products.filter(p => p.id !== id))
        if (editingId === id) {
          resetForm()
        }
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      showMessage('error', error.message || 'Failed to delete product')
    }
  }

  // Get category name
  const getCategoryDisplay = (product) => {
    return product.category || 'N/A'
  }

  return (
    <div className="page inner">
      <section className="inner-hero">
        <div className="container">
          <p className="eyebrow">Admin Action</p>
          <h1>Add Product</h1>
          <p className="lead">
            Create product posts and manage them from one page with edit and delete actions.
          </p>
        </div>
      </section>

      <section className="inner-section">
        <div className="container admin-layout">
          {message.text && (
            <div className={`message message-${message.type}`}>
              {message.text}
            </div>
          )}

          <form className="card admin-form reveal" onSubmit={handleSubmit}>
            <h3>{isEditing ? 'Edit Product Post' : 'Create Product Post'}</h3>
            
            <label>
              Product Name *
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Chicken Biryani Masala"
                required
              />
            </label>
            
            <label>
              Category *
              <input
                name="category"
                type="text"
                value={formData.category || ''}
                onChange={handleChange}
                placeholder="Enter category name (e.g., Rice, Curry, Drinks)"
                required
              />
            </label>
            
            <label>
              Stock Quantity
              <input
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                placeholder="120"
              />
            </label>

            <label>
              SKU
              <input
                name="sku"
                type="text"
                value={formData.sku}
                onChange={handleChange}
                placeholder="SKU-001"
              />
            </label>
            
            <label>
              Short Description
              <input
                name="short_description"
                type="text"
                value={formData.short_description}
                onChange={handleChange}
                placeholder="Brief product summary"
              />
            </label>
            
            <label>
              Description
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Full product description"
              />
            </label>

            <label>
              Product Image
              <div className="image-upload-wrapper">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="image-input"
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img 
                      src={imagePreview.startsWith('data:') ? imagePreview : `http://localhost:8000/${imagePreview}`} 
                      alt="Preview" 
                    />
                    <button 
                      type="button" 
                      className="remove-image"
                      onClick={() => {
                        setSelectedImage(null)
                        setImagePreview('')
                        setFormData(prev => ({ ...prev, image: '' }))
                      }}
                    >
                      ×
                    </button>
                  </div>
                )}
                {uploading && <p className="upload-status">Uploading...</p>}
              </div>
            </label>

            <label className="checkbox-label">
              <input
                name="is_featured"
                type="checkbox"
                checked={formData.is_featured}
                onChange={handleChange}
              />
              Featured Product
            </label>

            <label className="checkbox-label">
              <input
                name="is_active"
                type="checkbox"
                checked={formData.is_active}
                onChange={handleChange}
              />
              Active
            </label>
            
            <div className="admin-actions">
              <button type="submit" className="hero-btn" disabled={saving}>
                {saving ? 'Saving...' : (isEditing ? 'Update Product' : 'Save Product')}
              </button>
              {isEditing && (
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  Cancel Edit
                </button>
              )}
            </div>
          </form>

          <div className="card reveal">
            <h3>Product Posts</h3>
            {loading ? (
              <p className="lead">Loading products...</p>
            ) : products.length === 0 ? (
              <p className="lead">No product posts available yet.</p>
            ) : (
              <div className="table-wrap">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                      <td>
                        <div className="product-cell">
                          {product.image && (
                            <img 
                              src={`http://localhost:8000/${product.image}`} 
                              alt="" 
                              className="table-product-image"
                            />
                          )}
                          <span>{product.name}</span>
                        </div>
                      </td>
                        <td>{getCategoryDisplay(product)}</td>
                        <td>PKR {product.price}</td>
                        <td>{product.stock_quantity || 0}</td>
                        <td>
                          {product.is_active ? 
                            <span className="status-active">Active</span> : 
                            <span className="status-inactive">Inactive</span>
                          }
                        </td>
                        <td className="table-actions">
                          <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn-danger"
                            onClick={() => handleDelete(product.id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
