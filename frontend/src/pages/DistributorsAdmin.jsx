import { useState, useEffect } from 'react'
import { FaBuilding, FaUser, FaEnvelope, FaPhone, FaMapMarker, FaCheck, FaTimes, FaTrash, FaBox, FaPlus, FaEdit, FaShoppingCart } from 'react-icons/fa'
import { getDistributors, getDistributorsAdmin, createDistributor, updateDistributor, deleteDistributor, getOrdersAdmin, createOrder, updateOrder, deleteOrder } from '../services/api'

export default function DistributorsAdmin() {
  const [applications, setApplications] = useState([])
  const [distributors, setDistributors] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('applications')
  const [showForm, setShowForm] = useState(false)
  const [showOrderForm, setShowOrderForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editingOrderId, setEditingOrderId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    company_name: '',
    owner_name: '',
    email: '',
    phone: '',
    city: '',
    address: '',
    status: 'active'
  })
  
  // Order form state
  const [orderFormData, setOrderFormData] = useState({
    distributor_id: '',
    items: [{ name: '', quantity: 1, price: 0 }],
    total_amount: 0,
    status: 'pending',
    notes: ''
  })

  useEffect(() => {
    loadApplications()
    loadDistributors()
    loadOrders()
  }, [])

  const loadDistributors = async () => {
    try {
      const response = await getDistributorsAdmin()
      if (response.success) {
        setDistributors(response.data)
      }
    } catch (error) {
      console.error('Error loading distributors:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadOrders = async () => {
    try {
      const response = await getOrdersAdmin()
      if (response.success) {
        setOrders(response.data)
      }
    } catch (error) {
      console.error('Error loading orders:', error)
    }
  }

  const loadApplications = () => {
    const apps = JSON.parse(localStorage.getItem('distributorApplications') || '[]')
    setApplications(apps.reverse())
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await updateDistributor(editingId, formData)
      } else {
        await createDistributor(formData)
      }
      loadDistributors()
      setShowForm(false)
      setEditingId(null)
      setFormData({
        name: '',
        company_name: '',
        owner_name: '',
        email: '',
        phone: '',
        city: '',
        address: '',
        status: 'active'
      })
    } catch (error) {
      console.error('Error saving distributor:', error)
      alert('Failed to save distributor')
    }
  }

  const handleOrderSubmit = async (e) => {
    e.preventDefault()
    try {
      const orderData = {
        ...orderFormData,
        distributor_id: orderFormData.distributor_id ? parseInt(orderFormData.distributor_id) : null,
        items: orderFormData.items.filter(item => item.name && item.quantity > 0)
      }
      
      if (editingOrderId) {
        await updateOrder(editingOrderId, orderData)
      } else {
        await createOrder(orderData)
      }
      loadOrders()
      setShowOrderForm(false)
      setEditingOrderId(null)
      resetOrderForm()
    } catch (error) {
      console.error('Error saving order:', error)
      alert('Failed to save order')
    }
  }

  const resetOrderForm = () => {
    setOrderFormData({
      distributor_id: '',
      items: [{ name: '', quantity: 1, price: 0 }],
      total_amount: 0,
      status: 'pending',
      notes: ''
    })
  }

  const handleEdit = (dist) => {
    setFormData({
      name: dist.name || '',
      company_name: dist.company_name || '',
      owner_name: dist.owner_name || '',
      email: dist.email || '',
      phone: dist.phone || '',
      city: dist.city || '',
      address: dist.address || '',
      status: dist.status || 'active'
    })
    setEditingId(dist.id)
    setShowForm(true)
  }

  const handleEditOrder = (order) => {
    let items = []
    try {
      items = typeof order.items === 'string' ? JSON.parse(order.items) : order.items
    } catch (e) {
      items = [{ name: '', quantity: 1, price: 0 }]
    }
    
    setOrderFormData({
      distributor_id: order.distributor_id ? String(order.distributor_id) : '',
      items: items.length > 0 ? items : [{ name: '', quantity: 1, price: 0 }],
      total_amount: order.total_amount || 0,
      status: order.status || 'pending',
      notes: order.notes || ''
    })
    setEditingOrderId(order.id)
    setShowOrderForm(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this distributor?')) {
      try {
        await deleteDistributor(id)
        loadDistributors()
      } catch (error) {
        console.error('Error deleting distributor:', error)
        alert('Failed to delete distributor')
      }
    }
  }

  const handleDeleteOrder = async (id) => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteOrder(id)
        loadOrders()
      } catch (error) {
        console.error('Error deleting order:', error)
        alert('Failed to delete order')
      }
    }
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

  // Order item management
  const addOrderItem = () => {
    setOrderFormData({
      ...orderFormData,
      items: [...orderFormData.items, { name: '', quantity: 1, price: 0 }]
    })
  }

  const removeOrderItem = (index) => {
    const newItems = orderFormData.items.filter((_, i) => i !== index)
    setOrderFormData({
      ...orderFormData,
      items: newItems.length > 0 ? newItems : [{ name: '', quantity: 1, price: 0 }]
    })
    calculateTotal(newItems)
  }

  const updateOrderItem = (index, field, value) => {
    const newItems = [...orderFormData.items]
    newItems[index] = { ...newItems[index], [field]: value }
    setOrderFormData({
      ...orderFormData,
      items: newItems
    })
    calculateTotal(newItems)
  }

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => {
      return sum + (parseFloat(item.quantity || 0) * parseFloat(item.price || 0))
    }, 0)
    setOrderFormData(prev => ({ ...prev, total_amount: total }))
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

  const getItemsSummary = (items) => {
    try {
      const parsed = typeof items === 'string' ? JSON.parse(items) : items
      if (!Array.isArray(parsed)) return '-'
      return parsed.map(item => `${item.name} (x${item.quantity})`).join(', ')
    } catch (e) {
      return '-'
    }
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
              <FaShoppingCart /> Orders
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Registered Distributors</h3>
                <button 
                  onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: '', company_name: '', owner_name: '', email: '', phone: '', city: '', address: '', status: 'active' }) }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#d4a574', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                  <FaPlus /> Add Distributor
                </button>
              </div>
              
              {showForm && (
                <div style={{ background: '#f5f0ea', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                  <h4>{editingId ? 'Edit Distributor' : 'Add New Distributor'}</h4>
                  <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px', marginTop: '15px' }}>
                    <input type="text" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                    <input type="text" placeholder="Company Name" value={formData.company_name} onChange={e => setFormData({...formData, company_name: e.target.value})} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                    <input type="text" placeholder="Owner Name" value={formData.owner_name} onChange={e => setFormData({...formData, owner_name: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                    <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                    <input type="text" placeholder="Phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                    <input type="text" placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                    <input type="text" placeholder="Address" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="submit" style={{ padding: '10px 20px', background: '#d4a574', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Save</button>
                      <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px', background: '#ccc', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                    </div>
                  </form>
                </div>
              )}
              
              <div className="table-wrap">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Company Name</th>
                      <th>City</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan="6">Loading...</td></tr>
                    ) : distributors.length === 0 ? (
                      <tr><td colSpan="6">No distributors found</td></tr>
                    ) : (
                      distributors.map((dist) => (
                        <tr key={dist.id}>
                          <td>{dist.id}</td>
                          <td>{dist.company_name || dist.name}</td>
                          <td>{dist.city}</td>
                          <td>{dist.phone}</td>
                          <td>
                            <span className={`status-pill ${(dist.status || 'active').toLowerCase()}`}>{dist.status || 'Active'}</span>
                          </td>
                          <td>
                            <button onClick={() => handleEdit(dist)} style={{ marginRight: '10px', padding: '5px 10px', background: '#4a90a4', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><FaEdit /></button>
                            <button onClick={() => handleDelete(dist.id)} style={{ padding: '5px 10px', background: '#d9534f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}><FaTrash /></button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="card reveal">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Distributor Orders</h3>
                <button 
                  onClick={() => { setShowOrderForm(true); setEditingOrderId(null); resetOrderForm() }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', background: '#d4a574', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                  <FaPlus /> Add Order
                </button>
              </div>

              {/* Order Form Modal */}
              {showOrderForm && (
                <div style={{ background: '#f5f0ea', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
                  <h4>{editingOrderId ? 'Edit Order' : 'Add New Order'}</h4>
                  <form onSubmit={handleOrderSubmit}>
                    <div style={{ marginTop: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Distributor</label>
                      <select 
                        value={orderFormData.distributor_id} 
                        onChange={e => setOrderFormData({...orderFormData, distributor_id: e.target.value})}
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                      >
                        <option value="">-- Select Distributor (Optional) --</option>
                        {distributors.map(dist => (
                          <option key={dist.id} value={dist.id}>{dist.company_name || dist.name} - {dist.city}</option>
                        ))}
                      </select>
                    </div>

                    <div style={{ marginTop: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Order Items</label>
                      {orderFormData.items.map((item, index) => (
                        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'flex-end' }}>
                          <div style={{ flex: 2 }}>
                            <input 
                              type="text" 
                              placeholder="Product Name"
                              value={item.name}
                              onChange={e => updateOrderItem(index, 'name', e.target.value)}
                              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <input 
                              type="number" 
                              placeholder="Qty"
                              min="1"
                              value={item.quantity}
                              onChange={e => updateOrderItem(index, 'quantity', parseInt(e.target.value) || 0)}
                              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <input 
                              type="number" 
                              placeholder="Price"
                              min="0"
                              step="0.01"
                              value={item.price}
                              onChange={e => updateOrderItem(index, 'price', parseFloat(e.target.value) || 0)}
                              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
                            />
                          </div>
                          <div style={{ flex: 0.5 }}>
                            <span style={{ fontWeight: 'bold' }}>Rs. {(item.quantity * item.price).toLocaleString()}</span>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => removeOrderItem(index)}
                            style={{ padding: '8px 12px', background: '#d9534f', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                      <button 
                        type="button" 
                        onClick={addOrderItem}
                        style={{ padding: '8px 16px', background: '#4a90a4', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                      >
                        <FaPlus /> Add Item
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Total Amount (Rs.)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          value={orderFormData.total_amount}
                          onChange={e => setOrderFormData({...orderFormData, total_amount: parseFloat(e.target.value) || 0})}
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Status</label>
                        <select 
                          value={orderFormData.status}
                          onChange={e => setOrderFormData({...orderFormData, status: e.target.value})}
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ marginTop: '15px' }}>
                      <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Notes</label>
                      <textarea 
                        value={orderFormData.notes}
                        onChange={e => setOrderFormData({...orderFormData, notes: e.target.value})}
                        rows="3"
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                      <button type="submit" style={{ padding: '10px 20px', background: '#d4a574', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                        {editingOrderId ? 'Update Order' : 'Create Order'}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => { setShowOrderForm(false); setEditingOrderId(null); resetOrderForm() }}
                        style={{ padding: '10px 20px', background: '#ccc', color: '#333', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Orders Table */}
              <div className="table-wrap">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Distributor</th>
                      <th>Items</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan="7">No orders found</td></tr>
                    ) : (
                      orders.map((order) => (
                        <tr key={order.id}>
                          <td>{order.order_number}</td>
                          <td>{order.distributor ? (order.distributor.company_name || order.distributor.name) : '-'}</td>
                          <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {getItemsSummary(order.items)}
                          </td>
                          <td>Rs. {parseFloat(order.total_amount || 0).toLocaleString()}</td>
                          <td>
                            <span className={`status-pill ${order.status.toLowerCase()}`}>{order.status}</span>
                          </td>
                          <td>{formatDate(order.created_at)}</td>
                          <td>
                            <button 
                              onClick={() => handleEditOrder(order)} 
                              style={{ marginRight: '10px', padding: '5px 10px', background: '#4a90a4', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                              <FaEdit />
                            </button>
                            <button 
                              onClick={() => handleDeleteOrder(order.id)} 
                              style={{ padding: '5px 10px', background: '#d9534f', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
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
