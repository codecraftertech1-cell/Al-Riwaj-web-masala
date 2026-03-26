import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
    setSubmitted(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)

    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]')
    const newMessage = {
      id: Date.now(),
      ...formData,
      submittedAt: new Date().toISOString(),
      status: 'unread'
    }
    messages.push(newMessage)
    localStorage.setItem('contactMessages', JSON.stringify(messages))

    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 1000)
  }

  return (
    <div className="page inner">
      <section className="inner-hero">
        <div className="container">
          <p className="eyebrow">Contact</p>
          <h1>Get in Touch</h1>
          <p className="lead">
            Reach out for partnerships, support, and distribution inquiries.
          </p>
        </div>
      </section>

      <section className="inner-section">
        <div className="container">
          {submitted ? (
            <div style={{ 
              maxWidth: '500px', 
              margin: '0 auto', 
              textAlign: 'center',
              padding: '40px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>✓</div>
              <h3>Message Sent!</h3>
              <p>Thank you for contacting us. We will get back to you soon.</p>
              <button className="hero-btn" onClick={resetForm}>Send Another Message</button>
            </div>
          ) : (
            <div style={{ 
              maxWidth: '500px', 
              margin: '0 auto',
              padding: '30px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <form onSubmit={handleSubmit} style={{ 
                display: 'flex',
                flexDirection: 'column',
                gap: '15px'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                      Name *
                    </label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name" 
                      required 
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                      Email *
                    </label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@email.com" 
                      required 
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                      Phone
                    </label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+92 300 1234567" 
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                      Subject
                    </label>
                    <select 
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.3)',
                        background: 'rgba(255,255,255,0.1)',
                        color: 'white',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="" style={{background: '#333'}}>Select a subject</option>
                      <option value="general" style={{background: '#333'}}>General Inquiry</option>
                      <option value="partnership" style={{background: '#333'}}>Partnership</option>
                      <option value="distribution" style={{background: '#333'}}>Distribution</option>
                      <option value="support" style={{background: '#333'}}>Customer Support</option>
                      <option value="feedback" style={{background: '#333'}}>Feedback</option>
                      <option value="other" style={{background: '#333'}}>Other</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
                    Message *
                  </label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="5" 
                    placeholder="How can we help?" 
                    required 
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.3)',
                      background: 'rgba(255,255,255,0.1)',
                      color: 'white',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      resize: 'vertical'
                    }}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="hero-btn"
                  disabled={submitting}
                  style={{
                    marginTop: '10px',
                    padding: '14px 30px',
                    fontSize: '16px'
                  }}
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
