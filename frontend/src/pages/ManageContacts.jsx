import { useState, useEffect } from 'react'
import { FaEnvelope, FaPhone, FaUser, FaCheck, FaTrash, FaEye, FaComment } from 'react-icons/fa'

export default function ManageContacts() {
  const [messages, setMessages] = useState([])
  const [filter, setFilter] = useState('all')
  const [selectedMessage, setSelectedMessage] = useState(null)

  useEffect(() => {
    loadMessages()
  }, [])

  const loadMessages = () => {
    const msgs = JSON.parse(localStorage.getItem('contactMessages') || '[]')
    setMessages(msgs.reverse())
  }

  const markAsRead = (id) => {
    const msgs = JSON.parse(localStorage.getItem('contactMessages') || '[]')
    const updated = msgs.map(m => 
      m.id === id ? { ...m, status: 'read' } : m
    )
    localStorage.setItem('contactMessages', JSON.stringify(updated))
    loadMessages()
  }

  const deleteMessage = (id) => {
    if (confirm('Are you sure you want to delete this message?')) {
      const msgs = JSON.parse(localStorage.getItem('contactMessages') || '[]')
      const updated = msgs.filter(m => m.id !== id)
      localStorage.setItem('contactMessages', JSON.stringify(updated))
      loadMessages()
    }
  }

  const filteredMessages = messages.filter(m => {
    if (filter === 'all') return true
    return m.status === filter
  })

  const getSubjectLabel = (subject) => {
    const subjects = {
      general: 'General Inquiry',
      partnership: 'Partnership',
      distribution: 'Distribution',
      support: 'Customer Support',
      feedback: 'Feedback',
      other: 'Other'
    }
    return subjects[subject] || 'General Inquiry'
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

  const unreadCount = messages.filter(m => m.status === 'unread').length

  return (
    <div className="manage-contacts-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Admin Action</p>
          <h1>Manage Contact Messages</h1>
          <p className="lead">View messages submitted from the contact form.</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-number">{messages.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{unreadCount}</span>
            <span className="stat-label">Unread</span>
          </div>
        </div>
      </div>

      <div className="filters">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({messages.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </button>
        <button 
          className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
          onClick={() => setFilter('read')}
        >
          Read ({messages.filter(m => m.status === 'read').length})
        </button>
      </div>

      {filteredMessages.length === 0 ? (
        <div className="empty-state">
          <FaEnvelope />
          <h3>No messages found</h3>
          <p>There are no contact messages.</p>
        </div>
      ) : (
        <div className="messages-list">
          {filteredMessages.map(msg => (
            <div key={msg.id} className={`message-card ${msg.status}`}>
              <div className="message-header">
                <div className="message-info">
                  <h3>{msg.name}</h3>
                  <span className="message-subject">{getSubjectLabel(msg.subject)}</span>
                </div>
                <span className={`status-badge ${msg.status}`}>
                  {msg.status === 'unread' ? 'Unread' : 'Read'}
                </span>
              </div>

              <div className="message-details">
                <div className="detail-item">
                  <FaEnvelope />
                  <span>{msg.email}</span>
                </div>
                {msg.phone && (
                  <div className="detail-item">
                    <FaPhone />
                    <span>{msg.phone}</span>
                  </div>
                )}
                <div className="detail-item">
                  <FaUser />
                  <span>{formatDate(msg.submittedAt)}</span>
                </div>
              </div>

              <div className="message-content">
                <strong>Message:</strong>
                <p>{msg.message}</p>
              </div>

              <div className="message-actions">
                {msg.status === 'unread' && (
                  <button 
                    className="action-btn read"
                    onClick={() => markAsRead(msg.id)}
                  >
                    <FaCheck /> Mark as Read
                  </button>
                )}
                <button 
                  className="action-btn delete"
                  onClick={() => deleteMessage(msg.id)}
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
