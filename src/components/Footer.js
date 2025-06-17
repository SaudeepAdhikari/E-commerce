import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div>
          <div className="footer-brand">Demaj Tea</div>
          <div className="footer-divider"></div>
          <div className="footer-desc">
            Experience the finest handpicked teas from around the world. Demaj Tea brings you a blend of tradition, luxury, and wellness in every cup.
          </div>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
          </div>
        </div>
        <div className="footer-links">
          <a href="/" className="footer-link">Home</a>
          <a href="/tea" className="footer-link">Tea Collection</a>
          <a href="/story" className="footer-link">Our Story</a>
          <a href="/reviews" className="footer-link">Reviews</a>
          <a href="/profile" className="footer-link">My Account</a>
        </div>
      </div>
      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} Demaj Tea. All rights reserved.
      </div>
      <div className="footer-watermark">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M60 110C80 80 110 60 110 30C110 10 90 10 60 10C30 10 10 10 10 30C10 60 40 80 60 110Z" fill="currentColor" />
        </svg>
      </div>
    </footer>
  );
}

export default Footer;
