const inventoryItems = [
  { sku: 'MX-001', product: 'Biryani Mix', stock: 120, location: 'Karachi Warehouse' },
  { sku: 'SC-014', product: 'Tikka Sauce', stock: 64, location: 'Lahore Warehouse' },
  { sku: 'SP-031', product: 'Red Chilli Powder', stock: 210, location: 'Multan Warehouse' },
]

export default function ManageInventory() {
  return (
    <div className="page inner">
      <section className="inner-hero">
        <div className="container">
          <p className="eyebrow">Admin Action</p>
          <h1>Manage Inventory</h1>
          <p className="lead">Track stock levels and warehouse availability for each product.</p>
        </div>
      </section>

      <section className="inner-section">
        <div className="container card reveal">
          <h3>Inventory Snapshot</h3>
          <div className="table-wrap">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Product</th>
                  <th>Stock</th>
                  <th>Location</th>
                </tr>
              </thead>
              <tbody>
                {inventoryItems.map((item) => (
                  <tr key={item.sku}>
                    <td>{item.sku}</td>
                    <td>{item.product}</td>
                    <td>{item.stock}</td>
                    <td>{item.location}</td>
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
