import { useState, useEffect, useRef } from 'react'
import { FaPlus, FaEdit, FaTrash, FaSearch, FaTimes, FaImage, FaUpload } from 'react-icons/fa'
import { getRecipes, saveRecipes, addRecipe, updateRecipe, deleteRecipe as deleteRecipeFromStore, defaultRecipes } from '../data/recipesStore'

export default function ManageRecipes() {
  const [recipes, setRecipes] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingRecipe, setEditingRecipe] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    image: '',
    time: '',
    servings: '',
    difficulty: '',
    description: '',
    ingredients: '',
    steps: ''
  })

  // Load recipes from localStorage on mount
  useEffect(() => {
    setRecipes(getRecipes())
  }, [])

  const categories = ['Rice Dishes', 'BBQ', 'Curry', 'Snacks', 'Desserts', 'Drinks']

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle image file upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const openAddModal = () => {
    setEditingRecipe(null)
    setFormData({
      title: '',
      category: '',
      image: '',
      time: '',
      servings: '',
      difficulty: '',
      description: '',
      ingredients: '',
      steps: ''
    })
    setShowModal(true)
  }

  const openEditModal = (recipe) => {
    setEditingRecipe(recipe)
    setFormData({
      title: recipe.title,
      category: recipe.category,
      image: recipe.image,
      time: recipe.time,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      description: recipe.description,
      ingredients: recipe.ingredients.join('\n'),
      steps: recipe.steps.join('\n')
    })
    setShowModal(true)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const recipeData = {
      ...formData,
      ingredients: formData.ingredients.split('\n').filter(i => i.trim()),
      steps: formData.steps.split('\n').filter(s => s.trim())
    }

    if (editingRecipe) {
      const updated = updateRecipe(editingRecipe.id, recipeData)
      setRecipes(getRecipes())
    } else {
      addRecipe(recipeData)
      setRecipes(getRecipes())
    }
    
    setShowModal(false)
  }

  const deleteRecipe = (id) => {
    if (confirm('Are you sure you want to delete this recipe?')) {
      deleteRecipeFromStore(id)
      setRecipes(getRecipes())
    }
  }

  return (
    <div className="manage-recipes-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Admin Action</p>
          <h1>Manage Recipes</h1>
          <p className="lead">Add, edit, or delete recipes from the public recipes page.</p>
        </div>
        <button className="btn btn-primary" onClick={openAddModal}>
          <FaPlus /> Add Recipe
        </button>
      </div>

      <div className="search-filter-bar">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <span className="recipe-count">{filteredRecipes.length} recipes</span>
      </div>

      <div className="recipes-grid">
        {filteredRecipes.map(recipe => (
          <div key={recipe.id} className="recipe-card-admin">
            <div className="recipe-image">
              {recipe.image ? (
                <img src={recipe.image} alt={recipe.title} />
              ) : (
                <div className="no-image">
                  <FaImage />
                </div>
              )}
              <span className="recipe-category">{recipe.category}</span>
            </div>
            <div className="recipe-content">
              <h3>{recipe.title}</h3>
              <div className="recipe-meta">
                <span>⏱ {recipe.time}</span>
                <span>👥 {recipe.servings}</span>
                <span>📊 {recipe.difficulty}</span>
              </div>
              <p className="recipe-desc">{recipe.description}</p>
              <div className="recipe-actions">
                <button className="btn-edit" onClick={() => openEditModal(recipe)}>
                  <FaEdit /> Edit
                </button>
                <button className="btn-delete" onClick={() => deleteRecipe(recipe.id)}>
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="empty-state">
          <p>No recipes found. Try a different search or add a new recipe.</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Recipe Title *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Chicken Biryani"
                  />
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Recipe Image</label>
                  <div className="image-upload">
                    {formData.image ? (
                      <div className="image-preview">
                        <img src={formData.image} alt="Preview" />
                        <button type="button" className="remove-image" onClick={() => setFormData(prev => ({ ...prev, image: '' }))}>
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <label className="upload-label">
                        <FaUpload />
                        <span>Click to upload image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input
                    type="text"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Short description"
                  />
                </div>
              </div>

              <div className="form-row three-col">
                <div className="form-group">
                  <label>Prep Time</label>
                  <input
                    type="text"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    placeholder="e.g., 1 hour"
                  />
                </div>
                <div className="form-group">
                  <label>Servings</label>
                  <input
                    type="text"
                    name="servings"
                    value={formData.servings}
                    onChange={handleInputChange}
                    placeholder="e.g., 4-5"
                  />
                </div>
                <div className="form-group">
                  <label>Difficulty</label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                  >
                    <option value="">Select</option>
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Ingredients (one per line) *</label>
                <textarea
                  name="ingredients"
                  value={formData.ingredients}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  placeholder="500g Chicken&#10;2 cups Rice&#10;1 tbsp Salt"
                />
              </div>

              <div className="form-group">
                <label>Instructions (one per line) *</label>
                <textarea
                  name="steps"
                  value={formData.steps}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  placeholder="Marinate chicken for 2 hours&#10;Cook rice separately&#10;Layer and dum cook"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  {editingRecipe ? 'Update Recipe' : 'Add Recipe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        .manage-recipes-page {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .page-header h1 {
          font-size: 2rem;
          color: #1a1a2e;
          margin: 0.25rem 0;
        }

        .page-header .lead {
          color: #666;
          margin: 0;
        }

        .eyebrow {
          color: #e94560;
          font-size: 0.85rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin: 0;
        }

        .search-filter-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .search-box {
          position: relative;
          flex: 1;
          max-width: 400px;
        }

        .search-box input {
          width: 100%;
          padding: 0.875rem 1rem 0.875rem 2.75rem;
          border: 2px solid #e2d8ce;
          border-radius: 10px;
          font-size: 1rem;
        }

        .search-box input:focus {
          outline: none;
          border-color: #e94560;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #999;
        }

        .recipe-count {
          color: #666;
          font-size: 0.9rem;
        }

        .recipes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
        }

        .recipe-card-admin {
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .recipe-card-admin:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
        }

        .recipe-image {
          position: relative;
          height: 180px;
          overflow: hidden;
        }

        .recipe-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .recipe-image .no-image {
          width: 100%;
          height: 100%;
          background: #f5f5f5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          color: #ccc;
        }

        .recipe-category {
          position: absolute;
          top: 1rem;
          left: 1rem;
          background: #e94560;
          color: #fff;
          padding: 0.35rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .recipe-content {
          padding: 1.25rem;
        }

        .recipe-content h3 {
          font-size: 1.2rem;
          color: #1a1a2e;
          margin: 0 0 0.75rem;
        }

        .recipe-meta {
          display: flex;
          gap: 1rem;
          font-size: 0.85rem;
          color: #666;
          margin-bottom: 0.75rem;
        }

        .recipe-desc {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .recipe-actions {
          display: flex;
          gap: 0.75rem;
        }

        .btn-edit, .btn-delete {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.6rem 1rem;
          border: none;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-edit {
          background: #f0f0f0;
          color: #333;
        }

        .btn-edit:hover {
          background: #e0e0e0;
        }

        .btn-delete {
          background: #fee;
          color: #e94560;
        }

        .btn-delete:hover {
          background: #fdd;
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #666;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-primary {
          background: linear-gradient(135deg, #e94560 0%, #ff6b6b 100%);
          color: #fff;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(233, 69, 96, 0.4);
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 2rem;
          overflow-y: auto;
        }

        .modal-content {
          background: #fff;
          border-radius: 20px;
          width: 100%;
          max-width: 700px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #eee;
        }

        .modal-header h2 {
          margin: 0;
          color: #1a1a2e;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          color: #666;
          padding: 0.5rem;
        }

        .modal-content form {
          padding: 2rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .form-row.three-col {
          grid-template-columns: 1fr 1fr 1fr;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #1a1a2e;
          font-weight: 500;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e2d8ce;
          border-radius: 10px;
          font-size: 1rem;
          font-family: inherit;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #e94560;
        }

        .form-group textarea {
          resize: vertical;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1.5rem;
        }

        .btn-cancel {
          padding: 0.75rem 1.5rem;
          background: #f0f0f0;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          cursor: pointer;
        }

        .btn-submit {
          padding: 0.75rem 2rem;
          background: linear-gradient(135deg, #e94560 0%, #ff6b6b 100%);
          color: #fff;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            gap: 1rem;
          }

          .recipes-grid {
            grid-template-columns: 1fr;
          }

          .form-row, .form-row.three-col {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
