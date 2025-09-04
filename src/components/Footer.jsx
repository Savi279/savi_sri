import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { customerCategoryApi } from '../api/customer_api'; // Adjust path if necessary

const Footer = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await customerCategoryApi.getAll();
        setCategories(response); // Assuming response is an array of category objects
      } catch (err) {
        console.error('Error fetching categories for footer:', err);
        setError('Failed to load categories.');
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <footer className="app-footer">
      <div className="why-choose">
        <h2>Why Choose Savi Sri?</h2>
        <div className="underline"></div>
        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">✨</div>
            <h3 className="feature-title">Artisan Crafted</h3>
            <p>Each piece is meticulously handcrafted</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌿</div>
            <h3 className="feature-title">Sustainable</h3>
            <p>Eco-friendly materials and ethical production practices</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💎</div>
            <h3 className="feature-title">Premium Quality</h3>
            <p>Only the finest fabrics and materials make it to our collection</p>
          </div>
        </div>
      </div>

      <div className="footer-content">
        <div className="footer-brand">
          <img src="/images/SaviSriLogo.png" alt="Savi Sri Logo" className="footer-logo" />
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
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>Error loading categories.</p>
          ) : (
            categories.map(category => (
              <Link key={category._id} to={`/collections?category=${category.name}`} className="footer-link">{category.name} Kurtis</Link>
            ))
          )}
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
  );
};

export default Footer;
