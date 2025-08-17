import React from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../contexts/FavoritesContext';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';
import '../styleSheets/favorites.css';

const Favorites = () => {
  const { favorites, removeFromFavorites, toggleFavorite } = useFavorites();

  if (favorites.length === 0) {
    return (
      <div className="favorites-container">
        <h1>Your Favorites</h1>
        <div className="empty-favorites">
          <div className="empty-favorites-icon">💝</div>
          <h2>Your favorites list is empty</h2>
          <p>Add some beautiful kurtis to your favorites to see them here!</p>
          <Link to="/collections" className="browse-collections-btn">
            Browse Collections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <h1>Your Favorites ({favorites.length} items)</h1>
      
      <div className="favorites-grid">
        {favorites.map((product) => (
          <div key={product.id} className="favorite-item-card">
            <Link to={`/product/${product.id}`}>
              <img 
                src={product.images[0]} 
                alt={product.title}
                className="favorite-item-image"
              />
            </Link>
            
            <div className="favorite-item-details">
              <h3 className="favorite-item-title">{product.title}</h3>
              <p className="favorite-item-price">₹{product.price}</p>
              
              <div className="favorite-item-actions">
                <Link 
                  to={`/product/${product.id}`} 
                  className="view-product-btn"
                >
                  View Product
                </Link>
                
                <button 
                  className="remove-favorite-btn"
                  onClick={() => removeFromFavorites(product.id)}
                  title="Remove from favorites"
                >
                  <FaTrash />
                </button>
               
              </div>

              
            </div>

          </div>
        ))}
      </div>

       <div className="GotoButtons">
                 <button className="goto-cart-btn" title="Go to Cart">
                  <Link to="/cart" style={{ textDecoration: 'none', color: 'white', fontSize: '16px',fontWeight: 'bold' }}>
                  Add to Cart
                  </Link>
                </button>

                <button className="goto-collections-btn" title="Go to Collections">
                  <Link to="/collections" style={{ textDecoration: 'none', color: 'white', fontSize: '16px',fontWeight: 'bold' }}>
                   See More Collections
                  </Link>
                </button>
                </div>
    </div>
  );
};

export default Favorites;
