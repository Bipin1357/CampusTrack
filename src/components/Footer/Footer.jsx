import React from 'react';
import Logo from '../common/Logo';

function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-top">
          <div className="brand flex items-center gap-2.5">
            <Logo className="h-8 w-auto" />
            <span>CampusTrack</span>
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
