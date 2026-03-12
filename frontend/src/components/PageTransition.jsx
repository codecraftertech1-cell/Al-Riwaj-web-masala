import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function PageTransition({ children, timeout = 2500 }) {
  const [showTransition, setShowTransition] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Show transition when location changes
    setShowTransition(true)
    
    const timer = setTimeout(() => {
      setShowTransition(false)
    }, timeout)

    return () => clearTimeout(timer)
  }, [location.pathname, timeout])

  if (!showTransition) {
    return (
      <div className="main-content">
        {children}
      </div>
    )
  }

  return (
    <>
      <div className="page-transition-overlay">
        <div className="transition-content">
          <div className="brand-logo">
            <img src="http://127.0.0.1:8000/brand/logo.png" alt="Al-Riwaj" />
          </div>
          <h1 className="brand-title">
            <span className="title-word">Al-Riwaj</span>
            <span className="title-word">Classic</span>
            <span className="title-word">Foods</span>
          </h1>
          <p className="brand-tagline">Authentic Pakistani Spices & Recipes</p>
          <div className="loading-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
      <div className="main-content" style={{ opacity: 0 }}>
        {children}
      </div>

      <style>{`
        .page-transition-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            linear-gradient(135deg, rgba(30, 55, 90, 0.25) 0%, rgba(25, 45, 75, 0.3) 50%, rgba(20, 60, 100, 0.25) 100%),
            linear-gradient(135deg, #2c1810 0%, #4a2c17 50%, #8b5a2b 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .transition-content {
          text-align: center;
          color: #fff;
        }

        .brand-logo {
          width: 120px;
          height: 120px;
          margin: 0 auto 2rem;
          animation: scaleIn 0.5s ease;
        }

        .brand-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        @keyframes scaleIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .brand-title {
          font-family: 'Playfair Display', serif;
          font-size: 3rem;
          font-weight: 700;
          margin: 0 0 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .title-word {
          display: block;
          animation: slideUp 0.5s ease forwards;
          opacity: 0;
        }

        .title-word:nth-child(1) {
          animation-delay: 0.2s;
        }

        .title-word:nth-child(2) {
          animation-delay: 0.4s;
          color: #d4a157;
        }

        .title-word:nth-child(3) {
          animation-delay: 0.6s;
        }

        @keyframes slideUp {
          from { 
            transform: translateY(20px); 
            opacity: 0; 
          }
          to { 
            transform: translateY(0); 
            opacity: 1; 
          }
        }

        .brand-tagline {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.7);
          margin: 1rem 0 2rem;
          animation: fadeIn 0.5s ease 0.8s forwards;
          opacity: 0;
        }

        .loading-dots {
          display: flex;
          justify-content: center;
          gap: 0.5rem;
          animation: fadeIn 0.3s ease 1s forwards;
          opacity: 0;
        }

        .loading-dots span {
          width: 12px;
          height: 12px;
          background: #d4a157;
          border-radius: 50%;
          animation: bounce 1.4s infinite ease-in-out both;
        }

        .loading-dots span:nth-child(1) {
          animation-delay: -0.32s;
        }

        .loading-dots span:nth-child(2) {
          animation-delay: -0.16s;
        }

        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(0);
          }
          40% { 
            transform: scale(1);
          }
        }

        .main-content {
          transition: opacity 0.3s ease;
        }

        @media (max-width: 768px) {
          .brand-title {
            font-size: 2rem;
          }
          
          .brand-logo {
            width: 80px;
            height: 80px;
          }
        }
      `}</style>
    </>
  )
}
