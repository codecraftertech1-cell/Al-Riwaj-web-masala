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

    // Get existing messages
    const messages = JSON.parse(localStorage.getItem('contactMessages') || '[]')
    
    // Add new message
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
        <div className="container split">
          <div className="card">
            <h2>Head Office</h2>
            <p>29, Sector 23, Korangi Industrial Area, Karachi, Pakistan</p>
            <p>Phone: 021-35053076-79</p>
            <p>Email: info@alriwajfoods.com</p>
          </div>

          {submitted ? (
            <div className="success-message">
              <div className="success-icon">✓</div>
              <h3>Message Sent!</h3>
              <p>Thank you for contacting us. We will get back to you soon.</p>
              <button className="hero-btn" onClick={resetForm}>Send Another Message</button>
            </div>
          ) : (
            <form className="contact-form reveal" onSubmit={handleSubmit}>
              <div className="form-row">
                <label>
                  Name *
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name" 
                    required 
                  />
                </label>
                <label>
                  Email *
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@email.com" 
                    required 
                  />
                </label>
              </div>
              <div className="form-row">
                <label>
                  Phone
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+92 300 1234567" 
                  />
                </label>
                <label>
                  Subject
                  <select 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="partnership">Partnership</option>
                    <option value="distribution">Distribution</option>
                    <option value="support">Customer Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </label>
              </div>
              <label>
                Message *
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5" 
                  placeholder="How can we help?" 
                  required 
                />
              </label>
              <button type="submit" className="hero-btn" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
