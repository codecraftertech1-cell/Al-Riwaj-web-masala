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
      <section className="benefits-section">
        <div className="container">
          <h2 className="section-title reveal">Why Partner With Us?</h2>
          <p className="section-subtitle reveal">
            We offer comprehensive support to help our distributors succeed
          </p>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-card reveal" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="benefit-icon">{benefit.icon}</div>
                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="requirements-section">
        <div className="container">
          <div className="requirements-content">
            <div className="requirements-text">
              <h2 className="section-title reveal">Requirements</h2>
              <p className="reveal">
                To maintain our quality standards, we have specific requirements for our distribution partners:
              </p>
              <ul className="requirements-list reveal">
                {requirements.map((req, index) => (
                  <li key={index}>
                    <FaCheck className="check-icon" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>
            <div className="contact-info reveal">
              <h3>Have Questions?</h3>
              <p>Our distribution team is ready to assist you</p>
              <div className="contact-methods">
                <div className="contact-item">
                  <FaPhone />
                  <span>+92-42-111-245-111</span>
                </div>
                <div className="contact-item">
                  <FaEnvelope />
                  <span>distribution@alriwaj.com</span>
                </div>
                <div className="contact-item">
                  <FaMapMarkerAlt />
                  <span>Lahore, Pakistan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form Section */}
      <section className="application-section">
        <div className="container">
          <h2 className="section-title reveal">Apply Now</h2>
          <p className="section-subtitle reveal">
            Fill out the form below and our team will get back to you
          </p>
          <form className="distributor-form reveal" onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="companyName">Company / Business Name *</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your business name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="ownerName">Owner / Contact Person *</label>
                <input
                  type="text"
                  id="ownerName"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+92-300-1234567"
                />
              </div>
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder="Enter your city"
                />
              </div>
              <div className="form-group">
                <label htmlFor="monthlyCapacity">Estimated Monthly Order Value *</label>
                <select
                  id="monthlyCapacity"
                  name="monthlyCapacity"
                  value={formData.monthlyCapacity}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select range</option>
                  <option value="50k-100k">PKR 50,000 - 100,000</option>
                  <option value="100k-250k">PKR 100,000 - 250,000</option>
                  <option value="250k-500k">PKR 250,000 - 500,000</option>
                  <option value="500k+">PKR 500,000+</option>
                </select>
              </div>
            </div>
            <div className="form-group full-width">
              <label htmlFor="address">Business Address *</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Enter your complete business address"
              />
            </div>
            <div className="form-group full-width">
              <label>Products Interested In *</label>
              <div className="products-checkboxes">
                {products.map((product, index) => (
                  <label key={index} className="checkbox-label">
                    <input
                      type="checkbox"
                      value={product}
                      checked={formData.productsInterested.includes(product)}
                      onChange={handleCheckbox}
                    />
                    <span className="checkbox-custom"></span>
                    {product}
                  </label>
                ))}
              </div>
            </div>
            <div className="form-group full-width">
              <label htmlFor="message">Additional Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Tell us more about your business or any questions you have"
              />
            </div>
            <button type="submit" className="btn btn-primary btn-large">
              Submit Application
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
