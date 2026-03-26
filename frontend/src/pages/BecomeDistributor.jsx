import { useState } from 'react'
import { FaBox, FaTruck, FaHandshake, FaChartLine, FaCheck, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa'

export default function BecomeDistributor() {
  const [formData, setFormData] = useState({
    companyName: '',
    ownerName: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    productsInterested: [],
    monthlyCapacity: '',
    message: ''
  })

  const [submitted, setSubmitted] = useState(false)

  const resetForm = () => {
    setFormData({
      companyName: '',
      ownerName: '',
      email: '',
      phone: '',
      city: '',
      address: '',
      productsInterested: [],
      monthlyCapacity: '',
      message: ''
    })
    setSubmitted(false)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckbox = (e) => {
    const { value, checked } = e.target
    setFormData(prev => {
      if (checked) {
        return { ...prev, productsInterested: [...prev.productsInterested, value] }
      } else {
        return { ...prev, productsInterested: prev.productsInterested.filter(p => p !== value) }
      }
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Save to localStorage
    const applications = JSON.parse(localStorage.getItem('distributorApplications') || '[]')
    const newApplication = {
      id: Date.now(),
      ...formData,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    }
    applications.push(newApplication)
    localStorage.setItem('distributorApplications', JSON.stringify(applications))
    
    setSubmitted(true)
  }

  const benefits = [
    {
      icon: <FaBox />,
      title: 'Quality Products',
      description: 'Access to premium authentic spices and food products with consistent quality'
    },
    {
      icon: <FaTruck />,
      title: 'Reliable Delivery',
      description: 'Timely deliveries with proper cold chain and packaging maintained'
    },
    {
      icon: <FaHandshake />,
      title: 'Partnership Benefits',
      description: 'Competitive pricing, exclusive deals, and priority support for partners'
    },
    {
      icon: <FaChartLine />,
      title: 'Growth Opportunity',
      description: 'Join a growing brand with expanding market reach and increasing demand'
    }
  ]

  const requirements = [
    'Valid business registration (NTN/FBR)',
    'Physical storefront or warehouse',
    'Previous experience in food/spices distribution',
    'Transport facility for product delivery',
    'Good market reputation',
    'Minimum order quantity commitment'
  ]

  const products = [
    'Biryani Masala Mix',
    'Tikka Masala',
    'Nihari Mix',
    'Korma Masala',
    'Red Chilli Powder',
    'Coriander Powder',
    'Turmeric Powder',
    'Garam Masala',
    'All Spice',
    'Meat Tenderizer'
  ]

  if (submitted) {
    return (
      <div className="distributor-page">
        <section className="distributor-hero">
          <div className="container">
            <div className="success-message">
              <div className="success-icon">
                <FaCheck />
              </div>
              <h1>Application Submitted!</h1>
              <p>Thank you for your interest in becoming an Al-Riwaj distributor. Our team will review your application and contact you within 2-3 business days.</p>
              <button 
                type="button" 
                className="hero-btn" 
                onClick={() => {
                  alert('Button clicked! Resetting form...');
                  resetForm();
                }}
                style={{ 
                  marginTop: '1.5rem', 
                  display: 'inline-block',
                  padding: '12px 30px',
                  backgroundColor: '#b45309',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  zIndex: '100',
                  position: 'relative'
                }}
              >
                Submit Another Application
              </button>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="distributor-page">
      {/* Hero Section */}
      <section className="distributor-hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="reveal">Partner with Al-Riwaj Foods</h1>
            <p className="lead reveal">
              Join our growing network of distributors and bring authentic Pakistani spices to homes across the region
            </p>
            <div className="hero-stats reveal">
              <div className="stat">
                <span className="stat-number">50+</span>
                <span className="stat-label">Cities Covered</span>
              </div>
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Retail Partners</span>
              </div>
              <div className="stat">
                <span className="stat-number">10+</span>
                <span className="stat-label">Years Experience</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '4rem 0' }}>
        <div className="container">
          <h2 className="section-title reveal" style={{ color: '#fff' }}>Why Partner With Us?</h2>
          <p className="section-subtitle reveal" style={{ color: 'rgba(255,255,255,0.8)' }}>
            We offer comprehensive support to help our distributors succeed
          </p>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card reveal" style={{
                animationDelay: `${index * 0.1}s`,
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '16px',
                padding: '2rem',
                color: '#fff'
              }}>
                <div className="benefit-icon" style={{ color: '#667eea' }}>{benefit.icon}</div>
                <h3 style={{ color: '#fff' }}>{benefit.title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="requirements-section" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '4rem 0' }}>
        <div className="container">
          <div className="requirements-content" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <div className="requirements-text" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              padding: '2rem'
            }}>
              <h2 className="section-title reveal" style={{ color: '#fff' }}>Requirements</h2>
              <p className="reveal" style={{ color: 'rgba(255,255,255,0.8)' }}>
                To maintain our quality standards, we have specific requirements for our distribution partners:
              </p>
              <ul className="requirements-list reveal" style={{ color: '#fff' }}>
                {requirements.map((req, index) => (
                  <li key={index} style={{ color: '#fff' }}>
                    <FaCheck className="check-icon" style={{ color: '#28a745' }} />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
            <div className="contact-info reveal" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              padding: '2rem',
              color: '#fff'
            }}>
              <h3 style={{ color: '#fff' }}>Have Questions?</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)' }}>Our distribution team is ready to assist you</p>
              <div className="contact-methods">
                <div className="contact-item" style={{ color: '#fff' }}>
                  <FaPhone style={{ color: '#667eea' }} />
                  <span>+92-42-111-245-111</span>
                </div>
                <div className="contact-item" style={{ color: '#fff' }}>
                  <FaEnvelope style={{ color: '#667eea' }} />
                  <span>distribution@alriwaj.com</span>
                </div>
                <div className="contact-item" style={{ color: '#fff' }}>
                  <FaMapMarkerAlt style={{ color: '#667eea' }} />
                  <span>Lahore, Pakistan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="application-section" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '4rem 0' }}>
        <div className="container">
          <h2 className="section-title reveal" style={{ color: '#fff' }}>Apply Now</h2>
          <p className="section-subtitle reveal" style={{ color: 'rgba(255,255,255,0.8)' }}>
            Fill out the form below and our team will get back to you
          </p>
          <form className="distributor-form reveal" onSubmit={handleSubmit} style={{ 
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            padding: '2rem'
          }}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="companyName" style={{ color: '#fff' }}>Company / Business Name *</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your business name"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: '#fff',
                    padding: '0.75rem',
                    borderRadius: '8px'
                  }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="ownerName" style={{ color: '#fff' }}>Owner / Contact Person *</label>
                <input
                  type="text"
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: '#fff',
                    padding: '0.75rem',
                    borderRadius: '8px'
                  }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" style={{ color: '#fff' }}>Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: '#fff',
                    padding: '0.75rem',
                    borderRadius: '8px'
                  }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone" style={{ color: '#fff' }}>Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+92-300-1234567"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: '#fff',
                    padding: '0.75rem',
                    borderRadius: '8px'
                  }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="city" style={{ color: '#fff' }}>City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Enter your city"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: '#fff',
                    padding: '0.75rem',
                    borderRadius: '8px'
                  }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="monthlyCapacity" style={{ color: '#fff' }}>Estimated Monthly Order Value *</label>
                <select
                  id="monthlyCapacity"
                  name="monthlyCapacity"
                  value={formData.monthlyCapacity}
                  onChange={handleChange}
                  required
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    color: '#fff',
                    padding: '0.75rem',
                    borderRadius: '8px'
                  }}
                >
                  <option value="" style={{ color: '#333' }}>Select range</option>
                  <option value="50k-100k" style={{ color: '#333' }}>PKR 50,000 - 100,000</option>
                  <option value="100k-250k" style={{ color: '#333' }}>PKR 100,000 - 250,000</option>
                  <option value="250k-500k" style={{ color: '#333' }}>PKR 250,000 - 500,000</option>
                  <option value="500k+" style={{ color: '#333' }}>PKR 500,000+</option>
                </select>
              </div>
            </div>
            <div className="form-group full-width">
              <label htmlFor="address" style={{ color: '#fff' }}>Business Address *</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Enter your complete business address"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#fff',
                  padding: '0.75rem',
                  borderRadius: '8px'
                }}
              />
            </div>
            <div className="form-group full-width">
              <label style={{ color: '#fff' }}>Products Interested In *</label>
              <div className="products-checkboxes" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                {products.map((product, index) => (
                  <label key={index} className="checkbox-label" style={{ color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      value={product}
                      checked={formData.productsInterested.includes(product)}
                      onChange={handleCheckbox}
                      style={{ accentColor: '#667eea' }}
                    />
                    {product}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group full-width">
              <label htmlFor="message" style={{ color: '#fff' }}>Additional Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us more about your business or any questions you have"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#fff',
                  padding: '0.75rem',
                  borderRadius: '8px'
                }}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary btn-large"
              onMouseOver={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #28a745 0%, #218838 100%)';
                e.target.style.transform = 'scale(1.02)';
                e.target.style.boxShadow = '0 8px 25px rgba(40, 167, 69, 0.5)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
              }}
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '30px',
                padding: '1rem 2.5rem',
                fontSize: '1.1rem',
                fontWeight: '600',
                color: '#fff',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                display: 'block',
                margin: '2rem auto 0'
              }}
            >
              Submit Application
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
