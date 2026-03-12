import { useState, useEffect } from 'react'
import { FaUpload, FaTimes, FaBriefcase, FaMapMarker, FaEnvelope, FaPhone, FaUser, FaFileAlt } from 'react-icons/fa'

const defaultJobs = [
  { role: 'Territory Sales Manager', location: 'Karachi', description: 'Lead sales operations in Karachi region' },
  { role: 'Quality Assurance Officer', location: 'Lahore', description: 'Ensure product quality standards' },
  { role: 'Digital Marketing Lead', location: 'Remote', description: 'Manage digital marketing campaigns' },
]

export default function Careers() {
  const [roles, setRoles] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    coverLetter: '',
    cv: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // Load jobs from localStorage or use defaults
    const storedJobs = JSON.parse(localStorage.getItem('jobPostings') || 'null')
    if (storedJobs && storedJobs.length > 0) {
      setRoles(storedJobs.filter(job => job.active))
    } else {
      setRoles(defaultJobs)
    }
  }, [])

  const openApplyModal = (role) => {
    setSelectedRole(role)
    setFormData({
      name: '',
      email: '',
      phone: '',
      position: role,
      experience: '',
      coverLetter: '',
      cv: ''
    })
    setSubmitted(false)
    setShowModal(true)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCVUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, cv: reader.result, cvName: file.name }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitting(true)

    // Get existing applications from localStorage
    const applications = JSON.parse(localStorage.getItem('careerApplications') || '[]')
    
    // Add new application
    const newApplication = {
      id: Date.now(),
      ...formData,
      appliedAt: new Date().toISOString(),
      status: 'pending'
    }
    
    applications.push(newApplication)
    localStorage.setItem('careerApplications', JSON.stringify(applications))

    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
    }, 1000)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedRole('')
    setSubmitted(false)
  }

  return (
    <div className="page inner">
      <section className="inner-hero">
        <div className="container">
          <p className="eyebrow">Careers</p>
          <h1>Join Our Family</h1>
          <p className="lead">
            Build a career with a brand that celebrates taste, culture, and
            innovation.
          </p>
        </div>
      </section>

      <section className="inner-section">
        <div className="container careers-grid">
          {roles.map((job) => (
            <div key={job.role} className="career-card reveal">
              <div className="career-card-header">
                <FaBriefcase className="career-icon" />
                <div>
                  <h3>{job.role}</h3>
                  <p className="muted"><FaMapMarker /> {job.location}</p>
                </div>
              </div>
              <p className="career-description">{job.description}</p>
              <button className="hero-btn" onClick={() => openApplyModal(job.role)}>Apply Now</button>
            </div>
          ))}
        </div>
      </section>

      {/* Application Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content career-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <FaTimes />
            </button>

            {submitted ? (
              <div className="success-message">
                <div className="success-icon">✓</div>
                <h3>Application Submitted!</h3>
                <p>Thank you for applying to {selectedRole}. We will review your application and get back to you soon.</p>
                <button className="hero-btn" onClick={closeModal}>Close</button>
              </div>
            ) : (
              <>
                <h2>Apply for {selectedRole}</h2>
                <p className="modal-subtitle">Fill in your details to apply</p>

                <form onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label><FaUser /> Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div className="form-group">
                      <label><FaEnvelope /> Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label><FaPhone /> Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        placeholder="+92 300 1234567"
                      />
                    </div>
                    <div className="form-group">
                      <label><FaBriefcase /> Position</label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        placeholder="Position applied for"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Work Experience *</label>
                    <select
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select experience</option>
                      <option value="fresher">Fresh Graduate</option>
                      <option value="1-2years">1-2 Years</option>
                      <option value="2-5years">2-5 Years</option>
                      <option value="5-10years">5-10 Years</option>
                      <option value="10+years">10+ Years</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label><FaFileAlt /> Upload CV/Resume *</label>
                    <div className="cv-upload">
                      {formData.cv ? (
                        <div className="cv-selected">
                          <span className="cv-name">{formData.cvName}</span>
                          <button type="button" className="remove-cv" onClick={() => setFormData(prev => ({ ...prev, cv: '', cvName: '' }))}>
                            <FaTimes />
                          </button>
                        </div>
                      ) : (
                        <label className="cv-upload-label">
                          <FaUpload />
                          <span>Click to upload CV (PDF, DOC)</span>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleCVUpload}
                            required
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Cover Letter / Additional Message</label>
                    <textarea
                      name="coverLetter"
                      value={formData.coverLetter}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Tell us why you'd like to join Al-Riwaj..."
                    />
                  </div>

                  <button type="submit" className="hero-btn submit-btn" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
