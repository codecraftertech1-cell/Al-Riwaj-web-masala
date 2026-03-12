import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaSearch, FaClock, FaUsers, FaChartLine } from 'react-icons/fa'
import { getRecipes } from '../data/recipesStore'

const categories = ['All', 'Rice Dishes', 'BBQ', 'Curry', 'Snacks', 'Desserts', 'Drinks']

export default function Recipes() {
  const [recipes, setRecipes] = useState([])
  const [filter, setFilter] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const loadedRecipes = getRecipes()
    setRecipes(loadedRecipes)
  }, [])

  const filteredRecipes = recipes.filter(recipe => {
    const matchesCategory = filter === 'All' || recipe.category === filter
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (recipe.description && recipe.description.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  return (
    <div className="page inner">
      {/* Hero Section */}
      <section className="recipes-hero">
        <div className="container">
          <div className="recipes-hero-content">
            <p className="eyebrow">Al-Riwaj Recipes</p>
            <h1>Cook Delicious Meals at Home</h1>
            <p className="lead">
              Discover easy-to-follow recipes made with our authentic spices and cooking sauces. 
              From classic biryanis to flavorful curries - bring the taste of Pakistan to your kitchen!
            </p>
            <div className="recipes-hero-stats">
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Recipes</span>
              </div>
              <div className="stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">Authentic</span>
              </div>
              <div className="stat">
                <span className="stat-number">10+</span>
                <span className="stat-label">Categories</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="filters-section">
        <div className="container">
          <div className="filters-wrapper">
            <div className="category-filters">
              {categories.map(cat => (
                <button
                  key={cat}
                  className={`filter-btn ${filter === cat ? 'active' : ''}`}
                  onClick={() => setFilter(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Recipes Grid */}
      <section className="inner-section">
        <div className="container">
          <p className="recipes-count">{filteredRecipes.length} recipes found</p>
          <div className="recipes-grid">
            {filteredRecipes.map((recipe) => (
              <article key={recipe.id} className="recipe-card reveal">
                <div 
                  className="recipe-image" 
                  style={{ backgroundImage: `url(${recipe.image || '/brand/hero.jpeg'})` }}
                >
                  <span className="recipe-category-badge">{recipe.category}</span>
                </div>
                <div className="recipe-content">
                  <h3>{recipe.title}</h3>
                  <p>{recipe.description}</p>
                  <div className="recipe-meta">
                    <span>⏱ {recipe.time}</span>
                    <span>👥 {recipe.servings}</span>
                    <span>📊 {recipe.difficulty}</span>
                  </div>
                  <Link to={`/recipes/${recipe.id}`} className="recipe-btn">
                    View Recipe
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
