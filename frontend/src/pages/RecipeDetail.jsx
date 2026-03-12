import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaClock, FaUsers, FaChartLine } from 'react-icons/fa'
import { getRecipes } from '../data/recipesStore'

export default function RecipeDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState(null)

  useEffect(() => {
    const recipes = getRecipes()
    const found = recipes.find(r => r.id === parseInt(id))
    if (found) {
      setRecipe(found)
    } else {
      navigate('/recipes')
    }
  }, [id, navigate])

  if (!recipe) {
    return (
      <div className="page inner">
        <div className="container" style={{ padding: '100px 20px', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page recipe-detail-page">
      {/* Hero Image Section */}
      <div 
        className="recipe-detail-hero"
        style={{ 
          backgroundImage: `url(${recipe.image || '/brand/hero.jpeg'})`,
          height: '50vh',
          minHeight: '400px'
        }}
      >
        <div className="hero-overlay"></div>
        <div className="container">
          <Link to="/recipes" className="back-link">
            <FaArrowLeft /> Back to Recipes
          </Link>
          <span className="recipe-category-badge">{recipe.category}</span>
        </div>
      </div>

      {/* Content Section */}
      <section className="recipe-detail-content">
        <div className="container">
          <div className="recipe-header">
            <h1>{recipe.title}</h1>
            <p className="recipe-description">{recipe.description}</p>
            
            <div className="recipe-meta-large">
              <div className="meta-item">
                <FaClock />
                <div>
                  <span className="meta-label">Prep Time</span>
                  <span className="meta-value">{recipe.time}</span>
                </div>
              </div>
              <div className="meta-item">
                <FaUsers />
                <div>
                  <span className="meta-label">Servings</span>
                  <span className="meta-value">{recipe.servings}</span>
                </div>
              </div>
              <div className="meta-item">
                <FaChartLine />
                <div>
                  <span className="meta-label">Difficulty</span>
                  <span className="meta-value">{recipe.difficulty}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="recipe-sections">
            {/* Ingredients Section */}
            <div className="recipe-section-card">
              <h2>Ingredients</h2>
              <ul className="ingredients-list">
                {(recipe.ingredients || []).map((ing, i) => (
                  <li key={i}>
                    <span className="ingredient-bullet"></span>
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions Section */}
            <div className="recipe-section-card">
              <h2>Instructions</h2>
              <ol className="instructions-list">
                {(recipe.steps || []).map((step, i) => (
                  <li key={i}>
                    <span className="step-number">{i + 1}</span>
                    <span className="step-text">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .recipe-detail-page {
          padding-top: 0;
        }

        .recipe-detail-hero {
          position: relative;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: flex-end;
          padding: 2rem 0;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.7));
        }

        .recipe-detail-hero .container {
          position: relative;
          z-index: 1;
          width: 100%;
        }

        .back-link {
          position: absolute;
          top: -40vh;
          left: 0;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          color: #fff;
          text-decoration: none;
          font-weight: 500;
          padding: 0.75rem 1.25rem;
          background: rgba(0,0,0,0.5);
          border-radius: 8px;
          transition: background 0.2s;
        }

        .back-link:hover {
          background: rgba(0,0,0,0.7);
        }

        .recipe-category-badge {
          display: inline-block;
          background: #e94560;
          color: #fff;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .recipe-detail-content {
          padding: 3rem 0;
          background: #fff;
        }

        .recipe-header {
          text-align: center;
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #eee;
        }

        .recipe-header h1 {
          font-size: 2.5rem;
          color: #1a1a2e;
          margin-bottom: 1rem;
        }

        .recipe-description {
          font-size: 1.2rem;
          color: #666;
          max-width: 700px;
          margin: 0 auto 2rem;
          line-height: 1.7;
        }

        .recipe-meta-large {
          display: flex;
          justify-content: center;
          gap: 3rem;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .meta-item svg {
          font-size: 1.5rem;
          color: #e94560;
        }

        .meta-item > div {
          display: flex;
          flex-direction: column;
        }

        .meta-label {
          font-size: 0.85rem;
          color: #999;
          text-transform: uppercase;
        }

        .meta-value {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a1a2e;
        }

        .recipe-sections {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 2rem;
          max-width: 1100px;
          margin: 0 auto;
        }

        .recipe-section-card {
          background: #f9f9f9;
          border-radius: 16px;
          padding: 2rem;
        }

        .recipe-section-card h2 {
          font-size: 1.5rem;
          color: #1a1a2e;
          margin-bottom: 1.5rem;
          padding-bottom: 0.75rem;
          border-bottom: 2px solid #e94560;
        }

        .recipe-section-card .ingredients-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .recipe-section-card .ingredients-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          padding: 0.85rem 0;
          border-bottom: 1px solid #e0e0e0;
          font-size: 1.05rem;
          color: #1a1a2e;
        }

        .recipe-section-card .ingredients-list li:last-child {
          border-bottom: none;
        }

        .recipe-section-card .ingredient-bullet {
          width: 10px;
          height: 10px;
          background: #c4a77d;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 0.5rem;
        }

        .recipe-section-card .instructions-list {
          list-style: none;
          padding: 0;
          margin: 0;
          counter-reset: step-counter;
        }

        .recipe-section-card .instructions-list li {
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
          padding: 1rem 0;
          border-bottom: 1px solid #e0e0e0;
        }

        .recipe-section-card .instructions-list li:last-child {
          border-bottom: none;
        }

        .recipe-section-card .step-number {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #e94560 0%, #ff6b6b 100%);
          color: #fff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.9rem;
          font-weight: 600;
          flex-shrink: 0;
        }

        .recipe-section-card .step-text {
          font-size: 1.05rem;
          color: #1a1a2e;
          line-height: 1.7;
          padding-top: 0.25rem;
        }

        @media (max-width: 768px) {
          .recipe-header h1 {
            font-size: 1.75rem;
          }

          .recipe-sections {
            grid-template-columns: 1fr;
          }

          .recipe-meta-large {
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}
