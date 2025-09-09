import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectFavoritesCount } from '../store/favoritesSlice';
import { selectCartItemCount } from '../store/cartSlice';
import { FaUserCircle, FaBars, FaTimes, FaShoppingCart, FaHeart } from 'react-icons/fa';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const cartItemCount = useSelector(selectCartItemCount);
  const favoritesCount = useSelector(selectFavoritesCount);

  // Debug logging
  useEffect(() => {
    console.log('Header - Favorites count:', favoritesCount);
  }, [favoritesCount]);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="app-header">
      <div className="header-left">
        <img src="/images/SaviSriLogo.png" alt="Logo" className="app-logo" />
        <div className="title-container">
          <h1 className="site-title">Savi Sri</h1>
          <h1 className="tag-line">Wear Your Light</h1>
        </div>
      </div>

      <nav className={`app-nav ${menuOpen ? 'open' : ''}`}>
        <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
          Home
        </NavLink>
        <NavLink to="/collections" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
          Collection
        </NavLink>
        <NavLink to="/about-us" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
          About Us
        </NavLink>
        <NavLink to="/contactUs" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={closeMenu}>
          Contact Us
        </NavLink>
      </nav>

      <div className="header-right">
        <NavLink to="/favorites" className="favorites-link">
          {({ isActive }) => (
            <button className={`favorites-button${isActive ? ' active' : ''}`}>
              <FaHeart size={30} />
              {favoritesCount > 0 && (
                <span className="favorites-badge">{favoritesCount}</span>
              )}
            </button>
          )}
        </NavLink>
        <NavLink to="/cart" className="cart-link">
          {({ isActive }) => (
            <button className={`cart-button${isActive ? ' active' : ''}`}>
              <FaShoppingCart size={24} />
              {cartItemCount > 0 && (
                <span className="cart-badge">{cartItemCount}</span>
              )}
              Cart
            </button>
          )}
        </NavLink>

        <NavLink to="/profile" className={({ isActive }) => isActive ? 'profile-link active' : 'profile-link'}>
          <FaUserCircle size={50} />
        </NavLink>

        <button className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? <FaTimes size={30} /> : <FaBars size={30} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
