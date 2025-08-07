import React, { useState } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Link,
} from 'react-router-dom';
import Home from './components/home';
import Collections from './components/collections';
import AboutUs from './components/aboutUs';
import ContactUs from './components/contactUs';
import Profile from './components/profile';
import Cart from './components/cart';
import SaviSriLogo from './assests/Images/SaviSriLogo.png';
import { FaUserCircle, FaBars, FaTimes, FaShoppingCart } from 'react-icons/fa';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

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
          <NavLink to="/cart" className="cart-link">
            <button className="cart-button">
              <FaShoppingCart size={24} />
              {cartItems.length > 0 && (
                <span className="cart-badge">{cartItems.reduce((acc, item) => acc + item.quantity, 0)}</span>
              )}
              Cart
            </button>
          </NavLink>

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
          <Route path="/collections" element={<Collections addToCart={addToCart} />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contactUs" element={<ContactUs />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart cartItems={cartItems} setCartItems={setCartItems} />} />
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
            <Link to="/" className="footer-link">Home</Link>
            <Link to="/collections" className="footer-link">Collection</Link>
            <Link to="/about-us" className="footer-link">About</Link>
            <Link to="/contactUs" className="footer-link">Contact</Link>
          </div>

          <div className="footer-links">
            <h3>Categories</h3>
            <Link to="/collections?category=Short" className="footer-link">Short Kurtis</Link>
            <Link to="/collections?category=Long" className="footer-link">Long Kurtis</Link>
            <Link to="/collections?category=Anarkali" className="footer-link">Anarkali Kurtis</Link>
          </div>

          <div className="footer-links">
            <h3>Customer Care</h3>
            <Link to="/size-guide" className="footer-link">Size Guide</Link>
            <Link to="/return-policy" className="footer-link">Return Policy</Link>
            <Link to="/shipping-info" className="footer-link">Shipping Info</Link>
            <Link to="/faq" className="footer-link">FAQ</Link>
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
