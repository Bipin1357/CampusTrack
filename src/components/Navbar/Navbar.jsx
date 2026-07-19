import React, { useEffect, useState } from 'react';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="container nav-inner">
        <div className="brand">
          <div className="brand-mark">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M4 7L12 3L20 7L12 11L4 7Z" fill="white" />
              <path
                d="M4 7V17L12 21L20 17V7"
                stroke="white"
                strokeWidth="1.6"
                strokeLinejoin="round"
                fill="none"
                opacity="0.85"
              />
            </svg>
          </div>
          CampusTrack
        </div>
        <ul
          className="nav-links"
          style={{
            display: menuOpen ? 'flex' : '',
            ...(menuOpen
              ? {
                  position: 'fixed',
                  top: '64px',
                  left: '16px',
                  right: '16px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '20px',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '16px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                  zIndex: 99,
                }
              : {}),
          }}
        >
          <li>
            <a href="#top" onClick={() => setMenuOpen(false)}>
              Home
            </a>
          </li>
          <li>
            <a href="#features" onClick={() => setMenuOpen(false)}>
              Features
            </a>
          </li>
          <li>
            <a href="#dashboard" onClick={() => setMenuOpen(false)}>
              Dashboard
            </a>
          </li>
          <li>
            <a href="#faq" onClick={() => setMenuOpen(false)}>
              FAQ
            </a>
          </li>
        </ul>
        <div className="nav-actions">
          <a href="/login" className="login-link">
            Login
          </a>
          <a href="/login" className="btn btn-primary btn-sm">
            Sign Up
          </a>
          <button className="mobile-toggle" aria-label="Menu" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
