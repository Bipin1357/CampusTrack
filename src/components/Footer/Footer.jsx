import React from 'react';

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-top">
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
          <div className="footer-links">
            <div className="footer-col">
              <h5>Product</h5>
              <a href="#features">Features</a>
              <a href="#dashboard">Dashboard</a>
            </div>
            <div className="footer-col">
              <h5>Company</h5>
              <a href="#">Privacy Policy</a>
              <a href="#">Contact</a>
            </div>
            <div className="footer-col">
              <h5>Connect</h5>
              <a href="#">GitHub</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 CampusTrack. All rights reserved.</span>
          <span>Made with ❤️ for Students.</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
