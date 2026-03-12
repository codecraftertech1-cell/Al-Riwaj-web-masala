const users = [
  { name: 'Ayesha Khan', role: 'Admin', email: 'ayesha@alriwaj.com', status: 'Active' },
  { name: 'Bilal Ahmed', role: 'Inventory Manager', email: 'bilal@alriwaj.com', status: 'Active' },
  { name: 'Saad Malik', role: 'Support Agent', email: 'saad@alriwaj.com', status: 'Pending' },
]

export default function ManageUsers() {
  return (
    <div className="page inner">
      <section className="inner-hero">
        <div className="container">
          <p className="eyebrow">Admin Action</p>
          <h1>Manage Users</h1>
          <p className="lead">Review user roles, account states, and team access levels.</p>
        </div>
      </section>

      <section className="inner-section">
        <div className="container card reveal">
          <h3>Team Members</h3>
          <div className="table-wrap">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.email}>
                    <td>{user.name}</td>
                    <td>{user.role}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`status-pill ${user.status.toLowerCase()}`}>{user.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
