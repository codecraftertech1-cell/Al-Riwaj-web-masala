import { useState, useEffect } from 'react'
import { FaBriefcase, FaEnvelope, FaPhone, FaUser, FaFileAlt, FaCheck, FaTimes, FaDownload, FaTrash, FaPlus, FaEdit, FaMapMarker } from 'react-icons/fa'

const defaultJobs = [
  { id: 1, role: 'Territory Sales Manager', location: 'Karachi', description: 'Lead sales operations in Karachi region', active: true },
  { id: 2, role: 'Quality Assurance Officer', location: 'Lahore', description: 'Ensure product quality standards', active: true },
  { id: 3, role: 'Digital Marketing Lead', location: 'Remote', description: 'Manage digital marketing campaigns', active: true },
]

export default function ManageCareers() {
  const [activeTab, setActiveTab] = useState('jobs')
  const [applications, setApplications] = useState([])
  const [jobs, setJobs] = useState([])
  const [filter, setFilter] = useState('all')
  const [showJobModal, setShowJobModal] = useState(false)
  const [editingJob, setEditingJob] = useState(null)
  const [jobForm, setJobForm] = useState({ role: '', location: '', description: '' })

  useEffect(() => {
    loadApplications()
    loadJobs()
  }, [])

  const loadApplications = () => {
    const apps = JSON.parse(localStorage.getItem('careerApplications') || '[]')
    setApplications(apps.reverse())
  }

  const loadJobs = () => {
    const storedJobs = JSON.parse(localStorage.getItem('jobPostings') || 'null')
    if (storedJobs) {
      setJobs(storedJobs)
    } else {
      setJobs(defaultJobs)
      localStorage.setItem('jobPostings', JSON.stringify(defaultJobs))
    }
  }

  const saveJobs = (updatedJobs) => {
    setJobs(updatedJobs)
    localStorage.setItem('jobPostings', JSON.stringify(updatedJobs))
  }

  const updateStatus = (id, status) => {
    const apps = JSON.parse(localStorage.getItem('careerApplications') || '[]')
    const updated = apps.map(app => 
      app.id === id ? { ...app, status } : app
    )
    localStorage.setItem('careerApplications', JSON.stringify(updated))
    loadApplications()
  }

  const deleteApplication = (id) => {
    if (confirm('Are you sure you want to delete this application?')) {
      const apps = JSON.parse(localStorage.getItem('careerApplications') || '[]')
      const updated = apps.filter(app => app.id !== id)
      localStorage.setItem('careerApplications', JSON.stringify(updated))
      loadApplications()
    }
  }

  // Job Management Functions
  const openJobModal = (job = null) => {
    if (job) {
      setEditingJob(job)
      setJobForm({ role: job.role, location: job.location, description: job.description })
    } else {
      setEditingJob(null)
      setJobForm({ role: '', location: '', description: '' })
    }
    setShowJobModal(true)
  }

  const saveJob = (e) => {
    e.preventDefault()
    if (editingJob) {
      const updatedJobs = jobs.map(j => 
        j.id === editingJob.id ? { ...j, ...jobForm } : j
      )
      saveJobs(updatedJobs)
    } else {
      const newJob = { id: Date.now(), ...jobForm, active: true }
      saveJobs([...jobs, newJob])
    }
    setShowJobModal(false)
  }

  const deleteJob = (id) => {
    if (confirm('Are you sure you want to delete this job?')) {
      const updatedJobs = jobs.filter(j => j.id !== id)
      saveJobs(updatedJobs)
    }
  }

  const toggleJobActive = (id) => {
    const updatedJobs = jobs.map(j => 
      j.id === id ? { ...j, active: !j.active } : j
    )
    saveJobs(updatedJobs)
  }

  const filteredApps = applications.filter(app => {
    if (filter === 'all') return true
    return app.status === filter
  })

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="status-badge pending">Pending</span>
      case 'approved':
        return <span className="status-badge approved">Approved</span>
      case 'rejected':
        return <span className="status-badge rejected">Rejected</span>
      default:
        return <span className="status-badge">{status}</span>
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-PK', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="manage-careers-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Admin Action</p>
          <h1>Manage Careers</h1>
          <p className="lead">Manage job postings and view applications.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
          onClick={() => setActiveTab('jobs')}
        >
          <FaBriefcase /> Job Postings
        </button>
        <button 
          className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          <FaFileAlt /> Applications ({applications.length})
        </button>
      </div>

      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <div className="jobs-management">
          <div className="section-header">
            <h2>Job Postings</h2>
            <button className="btn btn-primary" onClick={() => openJobModal()}>
              <FaPlus /> Add New Job
            </button>
          </div>

          <div className="jobs-list">
            {jobs.map(job => (
              <div key={job.id} className={`job-card-admin ${job.active ? '' : 'inactive'}`}>
                <div className="job-info">
                  <h3>{job.role}</h3>
                  <p className="job-location"><FaMapMarker /> {job.location}</p>
                  <p className="job-desc">{job.description}</p>
                </div>
                <div className="job-status">
                  <span className={`status-badge ${job.active ? 'active' : 'inactive'}`}>
                    {job.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="job-actions">
                  <button className="action-btn edit" onClick={() => openJobModal(job)}>
                    <FaEdit /> Edit
                  </button>
                  <button className="action-btn toggle" onClick={() => toggleJobActive(job.id)}>
                    {job.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button className="action-btn delete" onClick={() => deleteJob(job.id)}>
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Applications Tab */}
      {activeTab === 'applications' && (
        <div className="applications-management">
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-number">{applications.length}</span>
              <span className="stat-label">Total</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{applications.filter(a => a.status === 'pending').length}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{applications.filter(a => a.status === 'approved').length}</span>
              <span className="stat-label">Approved</span>
            </div>
          </div>

          <div className="filters">
            <button 
              className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({applications.length})
            </button>
            <button 
              className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({applications.filter(a => a.status === 'pending').length})
            </button>
            <button 
              className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
              onClick={() => setFilter('approved')}
            >
              Approved ({applications.filter(a => a.status === 'approved').length})
            </button>
            <button 
              className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
              onClick={() => setFilter('rejected')}
            >
              Rejected ({applications.filter(a => a.status === 'rejected').length})
            </button>
          </div>

          {filteredApps.length === 0 ? (
            <div className="empty-state">
              <FaBriefcase />
              <h3>No applications found</h3>
              <p>There are no applications matching this filter.</p>
            </div>
          ) : (
            <div className="applications-list">
              {filteredApps.map(app => (
                <div key={app.id} className="application-card">
                  <div className="app-header">
                    <div className="app-info">
                      <h3>{app.name}</h3>
                      <p className="app-position">{app.position}</p>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>

                  <div className="app-details">
                    <div className="detail-item">
                      <FaEnvelope />
                      <span>{app.email}</span>
                    </div>
                    <div className="detail-item">
                      <FaPhone />
                      <span>{app.phone}</span>
                    </div>
                    <div className="detail-item">
                      <FaUser />
                      <span>{app.experience}</span>
                    </div>
                    <div className="detail-item">
                      <FaFileAlt />
                      <span>{app.cvName || 'CV Attached'}</span>
                    </div>
                  </div>

                  {app.coverLetter && (
                    <div className="app-cover-letter">
                      <strong>Cover Letter:</strong>
                      <p>{app.coverLetter}</p>
                    </div>
                  )}

                  <div className="app-meta">
                    <span className="applied-date">Applied: {formatDate(app.appliedAt)}</span>
                  </div>

                  <div className="app-actions">
                    {app.status === 'pending' && (
                      <>
                        <button 
                          className="action-btn approve"
                          onClick={() => updateStatus(app.id, 'approved')}
                        >
                          <FaCheck /> Approve
                        </button>
                        <button 
                          className="action-btn reject"
                          onClick={() => updateStatus(app.id, 'rejected')}
                        >
                          <FaTimes /> Reject
                        </button>
                      </>
                    )}
                    {app.cv && (
                      <a 
                        href={app.cv} 
                        download={`${app.name}_CV.pdf`}
                        className="action-btn download"
                      >
                        <FaDownload /> Download CV
                      </a>
                    )}
                    <button 
                      className="action-btn delete"
                      onClick={() => deleteApplication(app.id)}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Job Modal */}
      {showJobModal && (
        <div className="modal-overlay" onClick={() => setShowJobModal(false)}>
          <div className="modal-content job-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowJobModal(false)}>
              <FaTimes />
            </button>
            <h2>{editingJob ? 'Edit Job' : 'Add New Job'}</h2>
            <form onSubmit={saveJob}>
              <div className="form-group">
                <label>Job Title *</label>
                <input
                  type="text"
                  value={jobForm.role}
                  onChange={e => setJobForm({...jobForm, role: e.target.value})}
                  required
                  placeholder="e.g., Territory Sales Manager"
                />
              </div>
              <div className="form-group">
                <label>Location *</label>
                <input
                  type="text"
                  value={jobForm.location}
                  onChange={e => setJobForm({...jobForm, location: e.target.value})}
                  required
                  placeholder="e.g., Karachi, Lahore, Remote"
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={jobForm.description}
                  onChange={e => setJobForm({...jobForm, description: e.target.value})}
                  required
                  rows={3}
                  placeholder="Brief description of the job"
                />
              </div>
              <button type="submit" className="hero-btn">
                {editingJob ? 'Update Job' : 'Add Job'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
