import { NavLink } from 'react-router-dom'

export default function Signup() {
  return (
    <div className="page inner auth-page">
      <section className="inner-hero">
        <div className="container">
          <p className="eyebrow">Create Account</p>
          <h1>Signup</h1>
          <p className="lead">
            Register to save addresses, checkout faster, and stay updated with new launches.
          </p>
        </div>
      </section>

      <section className="inner-section">
        <div className="container auth-wrap">
          <form className="auth-card reveal">
            <h2>Join Al-Riwaj</h2>
            <label>
              Full Name
              <input type="text" placeholder="Enter your full name" />
            </label>
            <label>
              Email Address
              <input type="email" placeholder="you@email.com" />
            </label>
            <label>
              Phone Number
              <input type="tel" placeholder="+92 3xx xxx xxxx" />
            </label>
            <label>
              Password
              <input type="password" placeholder="Create a strong password" />
            </label>
            <label className="check">
              <input type="checkbox" />
              I agree to the terms and privacy policy.
            </label>
            <button type="button" className="hero-btn">Create Account</button>
            <p className="auth-switch">
              Already registered? <NavLink to="/login">Login here</NavLink>
            </p>
          </form>
        </div>
      </section>
    </div>
  )
}
