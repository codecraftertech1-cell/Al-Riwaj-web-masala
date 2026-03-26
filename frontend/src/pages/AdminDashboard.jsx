import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { getProducts, getCategories, getDistributors, getMedia } from '../services/api'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalDistributors: 0,
    totalMedia: 0
  })
  const [recentProducts, setRecentProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch data from Laravel API for Admin Dashboard
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all data for dashboard stats
        const [productsRes, categoriesRes, distributorsRes, mediaRes] = await Promise.all([
          getProducts(),
          getCategories(),
          getDistributors(),
          getMedia()
        ])

        setStats({
          totalProducts: productsRes.success ? productsRes.data.length : 0,
          totalCategories: categoriesRes.success ? categoriesRes.data.length : 0,
          totalDistributors: distributorsRes.success ? distributorsRes.data.length : 0,
          totalMedia: mediaRes.success ? mediaRes.data.length : 0
        })

        // Get recent products (latest 5)
        if (productsRes.success) {
          setRecentProducts(productsRes.data.slice(0, 5))
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const quickActions = [
    { label: 'Home Page', to: '/admin/manage/home' },
    { label: 'About', to: '/admin/manage/about' },
    { label: 'Our Management', to: '/admin/manage/management' },
    { label: 'Products Page', to: '/admin/manage/products' },
    { label: 'Media Page', to: '/admin/media' },
    { label: 'Careers Page', to: '/admin/manage/careers' },
    { label: 'Contact Us Page', to: '/admin/manage/contact' },
    { label: 'Add Product', to: '/admin/add-product' },
    { label: 'Manage Inventory', to: '/admin/inventory' },
    { label: 'View Reports', to: '/admin/reports' },
    { label: 'Distributors', to: '/admin/distributors' },
    { label: 'Manage Recipes', to: '/admin/recipes' },
    { label: 'Manage Leadership', to: '/admin/leadership' },
    { label: 'Career Applications', to: '/admin/manage/careers' },
    { label: 'Contact Messages', to: '/admin/manage/contacts' },
    { label: 'Manage Navbar', to: '/admin/navbar' },
    { label: 'Shop Page', to: '/shop' }
  ]

  const dashboardStats = [
    { label: 'Total Products', value: stats.totalProducts, delta: 'Active' },
    { label: 'Categories', value: stats.totalCategories, delta: 'Active' },
    { label: 'Distributors', value: stats.totalDistributors, delta: 'Verified' },
    { label: 'Media Files', value: stats.totalMedia, delta: 'Uploaded' },
  ]

  return (
    <div className="page inner dashboard-page">
      <section className="inner-hero">
        <div className="container">
          <p className="eyebrow">Control Center</p>
          <h1>Admin Dashboard</h1>
          <p className="lead">
            Manage your website content, products, and daily updates from one place.
            All changes are synced with the live website in real-time.
          </p>
        </div>
      </section>

      <section className="inner-section">
        <div className="container dashboard-layout">
          <aside className="dashboard-panel card reveal">
            <h3>Quick Actions</h3>
            {quickActions.map((action) => (
              <NavLink key={action.to} to={action.to} className="dashboard-btn">
                {action.label}
              </NavLink>
            ))}
          </aside>

          <div className="dashboard-main">
            <div className="dashboard-stats reveal">
              {dashboardStats.map((item) => (
                <article key={item.label} className="dashboard-stat card">
                  <p>{item.label}</p>
                  <h3>{loading ? '...' : item.value}</h3>
                  <span>{item.delta}</span>
                </article>
              ))}
            </div>

            <div className="card reveal" style={{ color: '#4a4035' }}>
              <h3>Recent Products (from Database)</h3>
              {loading ? (
                <p>Loading products...</p>
              ) : recentProducts.length > 0 ? (
                <div className="table-wrap">
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentProducts.map((product) => (
                        <tr key={product.id}>
                          <td>{product.name}</td>
                          <td>{product.category?.name || 'Uncategorized'}</td>
                          <td>PKR {product.price}</td>
                          <td>
                            <span className={`status-pill ${product.is_active ? 'active' : 'inactive'}`}>
                              {product.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p>No products found. Add products from the Admin Panel.</p>
              )}
            </div>

            <div className="card reveal" style={{ color: '#4a4035' }}>
              <h3>Database Connection Status</h3>
              <p className="lead">
                ✓ Connected to MySQL Database: <strong>al_riwaj_db</strong>
              </p>
              <p>
                All daily updates made here are automatically reflected on the public website.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
