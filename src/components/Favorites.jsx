import React from 'react';
import { Link } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { useFavorites } from '../hooks/useFavorites';
import '../styleSheets/favorites.css';

const Favorites = () => {
  const { favorites, removeFavorite, favoritesCount } = useFavorites();

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
          <div key={product._id} className="favorite-item-card">
            <Link to={`/product/${product._id}`}>
              <img
                src={`http://localhost:5000${product.images && product.images.length > 0 ? product.images[0] : product.imageUrl}`}
                alt={product.name}
                className="favorite-item-image"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/200x200/cccccc/000000?text=No+Image"; }}
              />
            </Link>

            <div className="favorite-item-details">
              <h3 className="favorite-item-title">{product.name}</h3>
              <p className="favorite-item-price">₹{product.price}</p>

              <div className="favorite-item-actions">
                <Link
                  to={`/product/${product._id}`}
                  className="view-product-btn"
                >
                  View Product
                </Link>

                <button
                  className="remove-favorite-btn"
                  onClick={() => removeFavorite(product._id)}
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
