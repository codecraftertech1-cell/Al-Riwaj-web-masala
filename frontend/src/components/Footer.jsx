export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <img className="footer-logo" src="/brand/logo.png" alt="Al-Riwaj" />
          <p className="muted">
            29, Sector 23, Korangi Industrial Area, Karachi, Pakistan
          </p>
          <p className="muted">021-35053076-79</p>
          <p className="muted">info@alriwajfoods.com</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li>About</li>
            <li>Careers</li>
            <li>Contact Us</li>
            <li>Sitemap</li>
            <li>Products</li>
            <li>FAQs</li>
          </ul>
        </div>
        <div>
          <h4>Get Social With Us</h4>
          <div className="social">
            <span>Facebook</span>
            <span>Instagram</span>
            <span>YouTube</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        Copyright © 2026, Al-Riwaj Foods
      </div>
    </footer>
  )
}
