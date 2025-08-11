import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../styleSheets/ProductView.css';
import { FaHeart, FaStar, FaShoppingCart, FaShoppingBag } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:5000/api/products/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setSelectedImage(0);
        setSelectedSize('');
        setError(null);
      })
      .catch(() => {
        setError('Failed to load product details. Please try again later.');
      });
  }, [id]);

  const isLoggedIn = () => {
    return !!localStorage.getItem('user');
  };

  const handleAddToCart = () => {
    if (!isLoggedIn()) {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    console.log('Added to cart:', product.title, 'Size:', selectedSize);
  };

  const handleBuyNow = () => {
    if (!isLoggedIn()) {
      navigate('/login', { state: { from: location } });
      return;
    }
    if (!selectedSize) {
      alert('Please select a size');
      return;
    }
    console.log('Buy now:', product.title, 'Size:', selectedSize);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleRating = (rating) => {
    if (!isLoggedIn()) {
      navigate('/profile', { state: { from: location } });
      return;
    }
    setUserRating(rating);
    // Here you can send rating to backend and update product rating
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!product) {
    return <div className="loading">Loading product details...</div>;
  }

  return (
    <div className="product-view-container">
      <div className="product-main-section">
        {/* Left Side - Images */}
        <div className="product-images-section">
          <div className="main-image-container">
            <img 
              src={product.images[selectedImage]} 
              alt={product.title}
              className="main-product-image"
            />
          </div>
          <div className="thumbnail-container">
            {product.images.map((image, index) => (
              <img 
                key={index}
                src={image}
                alt={`${product.title} ${index + 1}`}
                className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>

        {/* Right Side - Product Details */}
        <div className="product-details-section">
          <h1 className="product-title">{product.title}</h1>
          
          <p className="product-story">{product.story}</p>
          
          <div className="product-stats">
            {(product.views >= 10) ? (
              <div className="views-count">{product.views} views</div>
            ) : null}
            {(userRating > 0) ? (
              <div className="product-rating">
                <div className="stars">
                  {[...Array(userRating)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className="star filled"
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="product-price">
            <span className="price">{product.price}</span>
          </div>

          <div className="size-section">
            <h3>Select Size</h3>
            <div className="size-options">
              {product.sizes.map(size => (
                <button 
                  key={size}
                  className={`size-btn ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            <span 
              className="size-chart-link"
              onClick={() => setShowSizeChart(true)}
            >
              Size Chart
            </span>
          </div>

          <div className="rating-capture">
            <h4>Rate this product:</h4>
            <div className="stars">
              {[...Array(5)].map((_, i) => {
                const starIndex = i + 1;
                return (
                  <FaStar 
                    key={i} 
                    className={`star ${starIndex <= userRating ? 'filled' : ''}`}
                    onClick={() => handleRating(starIndex)}
                    style={{ cursor: 'pointer' }}
                  />
                );
              })}
            </div>
          </div>

          <div className="action-buttons">
            <button className="buy-now-btn" onClick={handleBuyNow}>
              <FaShoppingBag /> Buy Now
            </button>
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              <FaShoppingCart /> Add to Cart
            </button>
            <button 
              className={`favorite-btn ${isFavorite ? 'active' : ''}`}
              onClick={toggleFavorite}
            >
              <FaHeart />
            </button>
          </div>
        </div>
      </div>

      {/* Product Information Section */}
      <div className="product-info-section">
        <div className="info-tabs">
         
        </div>
        
        <div className="info-content">
          <h3>About the Product</h3>
          <p>{product.description}</p>
          
          <h4>Material & Care</h4>
          <p><strong>Material:</strong> {product.material}</p>
          <p><strong>Care Instructions:</strong> {product.care}</p>
          
          <h4>Product Details</h4>
          <ul>
            <li>Floral print design with vibrant colors</li>
            <li>A-line silhouette with pleated details</li>
            <li>Knee-length with flowing hem</li>
            <li>Concealed back zipper closure</li>
            <li>Fully lined for comfort</li>
          </ul>
        </div>
      </div>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div className="modal-overlay" onClick={() => setShowSizeChart(false)}>
          <div className="size-chart-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Size Chart</h3>
              <IoClose className="close-btn" onClick={() => setShowSizeChart(false)} />
            </div>
            <div className="size-chart-content">
              <table>
                <thead>
                  <tr>
                    <th>Size</th>
                    <th>Bust (inches)</th>
                    <th>Waist (inches)</th>
                    <th>Hip (inches)</th>
                    <th>Length (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>XS</td>
                    <td>32-34</td>
                    <td>24-26</td>
                    <td>34-36</td>
                    <td>36</td>
                  </tr>
                  <tr>
                    <td>S</td>
                    <td>34-36</td>
                    <td>26-28</td>
                    <td>36-38</td>
                    <td>37</td>
                  </tr>
                  <tr>
                    <td>M</td>
                    <td>36-38</td>
                    <td>28-30</td>
                    <td>38-40</td>
                    <td>38</td>
                  </tr>
                  <tr>
                    <td>L</td>
                    <td>38-40</td>
                    <td>30-32</td>
                    <td>40-42</td>
                    <td>39</td>
                  </tr>
                  <tr>
                    <td>XL</td>
                    <td>40-42</td>
                    <td>32-34</td>
                    <td>42-44</td>
                    <td>40</td>
                  </tr>
                  <tr>
                    <td>XXL</td>
                    <td>42-44</td>
                    <td>34-36</td>
                    <td>44-46</td>
                    <td>41</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ProductView;
