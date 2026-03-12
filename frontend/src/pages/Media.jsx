const posts = [
  { title: 'New Product Launch', date: 'Jan 12, 2026' },
  { title: 'Al-Riwaj wins quality award', date: 'Dec 08, 2025' },
  { title: 'Behind the spices: sourcing story', date: 'Nov 17, 2025' },
]

export default function Media() {
  return (
    <div className="page inner">
      <section className="inner-hero">
        <div className="container">
          <p className="eyebrow">Media</p>
          <h1>News & Updates</h1>
          <p className="lead">
            Latest announcements, campaigns, and brand stories.
          </p>
        </div>
      </section>

      <section className="inner-section">
        <div className="container grid">
          {posts.map((post) => (
            <article key={post.title} className="media-card reveal">
              <div className="media-thumb" />
              <div>
                <p className="muted">{post.date}</p>
                <h3>{post.title}</h3>
                <p>
                  Discover what’s new at Al-Riwaj and how we keep elevating your
                  culinary experience.
                </p>
                <button className="text-link">Read More</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
