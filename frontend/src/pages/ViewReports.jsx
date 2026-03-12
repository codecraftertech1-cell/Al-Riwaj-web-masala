const reportCards = [
  { title: 'Monthly Sales', value: 'PKR 2.4M', note: 'Up 8% from previous month' },
  { title: 'Top Category', value: 'Recipe Mixes', note: '34% contribution' },
  { title: 'Average Order Value', value: 'PKR 4,850', note: 'Stable this quarter' },
]

export default function ViewReports() {
  return (
    <div className="page inner">
      <section className="inner-hero">
        <div className="container">
          <p className="eyebrow">Admin Action</p>
          <h1>View Reports</h1>
          <p className="lead">Business analytics and operational metrics at a glance.</p>
        </div>
      </section>

      <section className="inner-section">
        <div className="container dashboard-stats reveal">
          {reportCards.map((report) => (
            <article key={report.title} className="dashboard-stat card">
              <p>{report.title}</p>
              <h3>{report.value}</h3>
              <span>{report.note}</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
