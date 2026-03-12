import { useState, useEffect } from 'react'
import { FaBuilding, FaUser, FaEnvelope, FaPhone, FaMapMarker, FaCheck, FaTimes, FaTrash, FaBox } from 'react-icons/fa'

const distributors = [
  {
    id: 'DST-001',
    name: 'Faisal Traders',
    city: 'Karachi',
    phone: '+92 300 1112233',
    status: 'Active',
  },
  {
    id: 'DST-002',
    name: 'Spice Point Distribution',
    city: 'Lahore',
    phone: '+92 301 4455667',
    status: 'Active',
  },
  {
    id: 'DST-003',
    name: 'Taste Hub Wholesalers',
    city: 'Islamabad',
    phone: '+92 333 8899776',
    status: 'Pending',
  },
]

const distributorOrders = [
  {
    orderId: 'D-ORD-901',
    distributor: 'Faisal Traders',
    items: 'Biryani Mix x 120, Tikka Sauce x 60',
    amount: 'PKR 118,000',
    status: 'Processing',
  },
  {
    orderId: 'D-ORD-902',
    distributor: 'Taste Hub Wholesalers',
    items: 'Red Chilli Powder x 200',
    amount: 'PKR 64,000',
    status: 'Pending',
  },
  {
    orderId: 'D-ORD-903',
    distributor: 'Spice Point Distribution',
    items: 'Nihari Mix x 140, Korma Mix x 120',
    amount: 'PKR 132,500',
    status: 'Paid',
  },
]

export default function DistributorsAdmin() {
  const [applications, setApplications] = useState([])
  const [activeTab, setActiveTab] = useState('applications')

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = () => {
    const apps = JSON.parse(localStorage.getItem('distributorApplications') || '[]')
    setApplications(apps.reverse())
  }

  const updateStatus = (id, status) => {
    const apps = JSON.parse(localStorage.getItem('distributorApplications') || '[]')
    const updated = apps.map(app => 
      app.id === id ? { ...app, status } : app
    )
    localStorage.setItem('distributorApplications', JSON.stringify(updated))
    loadApplications()
  }

  const deleteApplication = (id) => {
    if (confirm('Are you sure you want to delete this application?')) {
      const apps = JSON.parse(localStorage.getItem('distributorApplications') || '[]')
      const updated = apps.filter(app => app.id !== id)
      localStorage.setItem('distributorApplications', JSON.stringify(updated))
      loadApplications()
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

  const pendingCount = applications.filter(a => a.status === 'pending').length

  return (
    <div className="page inner">
      <section className="inner-hero">
        <div className="container">
          <p className="eyebrow">Admin Action</p>
          <h1>Distributors</h1>
          <p className="lead">
            Manage distributor applications, registered distributors, and orders.
          </p>
        </div>
      </section>

      <section className="inner-section">
        <div className="container">
          {/* Tabs */}
          <div className="admin-tabs">
            <button 
              className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
              onClick={() => setActiveTab('applications')}
            >
              <FaBox /> New Applications ({applications.length})
            </button>
            <button 
              className={`tab-btn ${activeTab === 'registered' ? 'active' : ''}`}
              onClick={() => setActiveTab('registered')}
            >
              <FaBuilding /> Registered Distributors
            </button>
            <button 
              className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </button>
          </div>

          {/* Applications Tab */}
          {activeTab === 'applications' && (
            <div className="dashboard-main">
              {applications.length === 0 ? (
                <div className="card">
                  <div className="empty-state">
                    <FaBox />
                    <h3>No new applications</h3>
                    <p>There are no new distributor applications.</p>
                  </div>
                </div>
              ) : (
                <div className="applications-list">
                  {applications.map(app => (
                    <div key={app.id} className="application-card distributor-app">
                      <div className="app-header">
                        <div className="app-info">
                          <h3><FaBuilding /> {app.companyName}</h3>
                          <span className={`status-badge ${app.status}`}>
                            {app.status === 'pending' ? 'Pending' : app.status}
                          </span>
                        </div>
                      </div>

                      <div className="app-details">
                        <div className="detail-item">
                          <FaUser />
                          <span>{app.ownerName}</span>
                        </div>
                        <div className="detail-item">
                          <FaEnvelope />
                          <span>{app.email}</span>
                        </div>
                        <div className="detail-item">
                          <FaPhone />
                          <span>{app.phone}</span>
                        </div>
                        <div className="detail-item">
                          <FaMapMarker />
                          <span>{app.city}</span>
                        </div>
                      </div>

                      <div className="app-info-section">
                        <strong>Address:</strong>
                        <p>{app.address}</p>
                      </div>

                      <div className="app-info-section">
                        <strong>Monthly Capacity:</strong>
                        <p>{app.monthlyCapacity}</p>
                      </div>

                      <div className="app-info-section">
                        <strong>Products Interested:</strong>
                        <div className="products-list">
                          {app.productsInterested.map((product, i) => (
                            <span key={i} className="product-tag">{product}</span>
                          ))}
                        </div>
                      </div>

                      {app.message && (
                        <div className="app-info-section">
                          <strong>Message:</strong>
                          <p>{app.message}</p>
                        </div>
                      )}

                      <div className="app-meta">
                        <span>Applied: {formatDate(app.submittedAt)}</span>
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

          {/* Registered Distributors Tab */}
          {activeTab === 'registered' && (
            <div className="card reveal">
              <h3>Registered Distributors</h3>
              <div className="table-wrap">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>City</th>
                      <th>Phone</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {distributors.map((dist) => (
                      <tr key={dist.id}>
                        <td>{dist.id}</td>
                        <td>{dist.name}</td>
                        <td>{dist.city}</td>
                        <td>{dist.phone}</td>
                        <td>
                          <span className={`status-pill ${dist.status.toLowerCase()}`}>{dist.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="card reveal">
              <h3>Distributor Orders</h3>
              <div className="table-wrap">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Distributor</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {distributorOrders.map((order) => (
                      <tr key={order.orderId}>
                        <td>{order.orderId}</td>
                        <td>{order.distributor}</td>
                        <td>{order.items}</td>
                        <td>{order.amount}</td>
                        <td>
                          <span className={`status-pill ${order.status.toLowerCase()}`}>{order.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
