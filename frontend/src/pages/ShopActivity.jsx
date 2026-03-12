const shopStats = [
  { label: 'New Orders Today', value: '34', delta: '+9%' },
  { label: 'Unread Messages', value: '12', delta: '+4' },
  { label: 'Low Stock Alerts', value: '7', delta: '+2' },
  { label: 'Returned Orders', value: '3', delta: '-1' },
]

const shopOrders = [
  { id: 'SHP-2101', customer: 'Areeba Khan', items: 'Biryani Mix x2', amount: 'PKR 900', status: 'Paid' },
  { id: 'SHP-2100', customer: 'Ali Raza', items: 'Tikka Sauce x1', amount: 'PKR 620', status: 'Processing' },
  { id: 'SHP-2098', customer: 'Sara Malik', items: 'Nihari Mix x3', amount: 'PKR 1,350', status: 'Pending' },
]

const customerMessages = [
  { name: 'Hassan Ahmed', message: 'Order #SHP-2100 kab dispatch hoga?', time: '11:20 AM' },
  { name: 'Nimra Saleem', message: 'Kya aapke paas family pack available hai?', time: '10:48 AM' },
  { name: 'Usman Tariq', message: 'Payment successful hai lekin order confirm nahi hua.', time: '09:32 AM' },
]

const productActivity = [
  { event: 'Chicken Biryani Masala stock updated', detail: '120 -> 98 units', time: '11:05 AM' },
  { event: 'New product post published', detail: 'Hyderabadi Biryani Mix', time: '10:10 AM' },
  { event: 'Low stock warning', detail: 'Tikka Sauce below threshold', time: '09:15 AM' },
]

export default function ShopActivity() {
  return (
    <div className="page inner">
      <section className="inner-hero">
        <div className="container">
          <p className="eyebrow">Admin Action</p>
          <h1>Shop Activity</h1>
          <p className="lead">Shop ki sari activity yahan show hoti hai: orders, messages, product updates.</p>
        </div>
      </section>

      <section className="inner-section">
        <div className="container dashboard-main">
          <div className="dashboard-stats reveal">
            {shopStats.map((item) => (
              <article key={item.label} className="dashboard-stat card">
                <p>{item.label}</p>
                <h3>{item.value}</h3>
                <span>{item.delta} today</span>
              </article>
            ))}
          </div>

          <div className="card reveal">
            <h3>Recent Shop Orders</h3>
            <div className="table-wrap">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {shopOrders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{order.customer}</td>
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

          <div className="activity-grid">
            <div className="card reveal">
              <h3>Customer Messages</h3>
              <div className="activity-list">
                {customerMessages.map((item) => (
                  <article key={`${item.name}-${item.time}`} className="activity-item">
                    <div className="message-head">
                      <strong>{item.name}</strong>
                      <span>{item.time}</span>
                    </div>
                    <p>{item.message}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="card reveal">
              <h3>Product Activity</h3>
              <div className="activity-list">
                {productActivity.map((item) => (
                  <article key={`${item.event}-${item.time}`} className="activity-item">
                    <div className="message-head">
                      <strong>{item.event}</strong>
                      <span>{item.time}</span>
                    </div>
                    <p>{item.detail}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
