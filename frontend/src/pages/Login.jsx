import { useState } from 'react'
import { useNavigate, NavLink } from 'react-router-dom'
import { login } from '../services/api'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await login(email, password)
      
      if (response.success) {
        // Redirect to dashboard after successful login
        navigate('/admin/dashboard')
      } else {
        setError(response.message || 'Login failed')
      }
    } catch (err) {
      setError(err.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page inner auth-page">
      <section className="inner-hero">
        <div className="container">
          <p className="eyebrow">Admin Access</p>
          <h1>Login</h1>
          <p className="lead">
            Sign in to manage your website content, products, and updates.
          </p>
        </div>
      </section>

      <section className="inner-section">
        <div className="container auth-wrap">
          <form className="auth-card reveal" onSubmit={handleSubmit}>
            <h2>Admin Login</h2>
            
            {error && (
              <div style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', background: '#ffe6e6', borderRadius: '4px' }}>
                {error}
              </div>
            )}
            
            <label>
              Email Address
              <input 
                type="email" 
                placeholder="admin@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <label>
              Password
              <input 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <div className="auth-row">
              <label className="check">
                <input type="checkbox" />
                Remember me
              </label>
              <button type="button" className="text-link">Forgot Password?</button>
            </div>
            <button type="submit" className="hero-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <p className="auth-switch">
              <NavLink to="/">Back to Home</NavLink>
            </p>
          </form>
        </div>
      </section>
    </div>
  )
}
