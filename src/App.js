import React, { useState } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from 'react-router-dom';
import Home from './components/home';
import Collections from './components/collections';
import AboutUs from './components/aboutUs';
import ContactUs from './components/contactUs';
import Profile from './components/profile';
import SaviSriLogo from './assests/Images/SaviSriLogo.png';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <Router>
      <header className="app-header">
        <div className="header-left">
          <img src={SaviSriLogo} alt="Logo" className="app-logo" />
          <div style={{ display: 'inline-block' }}>
            <h1 className="site-title">Savi Sri</h1>
            <h1 className="tag-line">Wear Your Light</h1>
          </div>
        </div>

        <nav className={`app-nav ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu} end>
            Home
          </NavLink>
          <NavLink to="/collections" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
            Collections
          </NavLink>
          <NavLink to="/about-us" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
            About Us
          </NavLink>
          <NavLink to="/contactUs" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
            Contact Us
          </NavLink>
        </nav>

        <div className="header-right">
          <NavLink to="/profile" className={({ isActive }) => isActive ? 'profile-link active' : 'profile-link'}>
            <FaUserCircle size={50} />
          </NavLink>

          <button className="menu-icon" onClick={toggleMenu}>
            {menuOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
          </button>
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contactUs" element={<ContactUs />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <div className="why-choose">
          <h2>Why Choose Savi Sri?</h2>
          <div className="underline"></div>
          <div className="features">
            <div className="feature-card">
              <div className="feature-icon">✨</div>
              <h3 style={{color:"#fff"}}>Artisan Crafted</h3>
              <p>Each piece is meticulously handcrafted</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌿</div>
              <h3>Sustainable</h3>
              <p>Eco-friendly materials and ethical production practices</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💎</div>
              <h3>Premium Quality</h3>
              <p>Only the finest fabrics and materials make it to our collection</p>
            </div>
          </div>
        </div>

        <div className="footer-content">
          <div className="footer-brand">
           <img src={SaviSriLogo} alt="Savi Sri Logo" className="footer-logo" />
            <div>
              <h2 className="footer-title">Savi Sri</h2>
              <p className="footer-subtitle">Wear Your Light</p>
              <p className="footer-desc">
                Elegant kurtis for the modern woman. Quality, style, and tradition in every piece.
              </p>
            </div>
          </div>

          <div className="footer-links">
            <h3>Quick Links</h3>
            <p className="Link">Home</p>
            <p className="Link">Collection</p>
            <p className="Link">About</p>
            <p className="Link">Contact</p>
          </div>

          <div className="footer-links">
            <h3>Categories</h3>
            <p className="Link">Short Kurtis</p>
            <p className="Link">Long Kurtis</p>
            <p className="Link">Anarkali Kurtis</p>
          </div>

          <div className="footer-links">
            <h3>Customer Care</h3>
            <p className="Link">Size Guide</p>
            <p className="Link">Return Policy</p>
            <p className="Link">Shipping Info</p>
            <p className="Link">FAQ</p>
          </div>
        </div>

        <div className="footer-bottom">
          © 2025 Savi Sri. All rights reserved. Crafted with ❤️ for modern women.
        </div>
      </footer>

    </Router>
  );
}

export default App;
