import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../styleSheets/ProductView.css';
import { FaHeart, FaStar, FaShoppingCart, FaShoppingBag } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
// Import customer APIs
import { customerProductApi } from '../api/customer_api'; // Adjust path if necessary
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice'; // Assuming you have an addToCart action
import { useFavorites } from '../hooks/useFavorites'; // Import the useFavorites hook

const ProductView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { toggleFavorite, useIsFavorite } = useFavorites();
  const isFavorite = useIsFavorite(id);

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState(0); // This should ideally come from backend user data
  const [loading, setLoading] = useState(true); // Added loading state
  const [reviews, setReviews] = useState([]); // Reviews for the product
  const [newReview, setNewReview] = useState(''); // New review text
  const [newReviewRating, setNewReviewRating] = useState(0); // New review rating
  const [submittingReview, setSubmittingReview] = useState(false); // Loading state for review submission
  const [relatedProducts, setRelatedProducts] = useState([]); // Related products state

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await customerProductApi.getById(id);
        setProduct(data);
        setReviews(data.reviews || []);
        setSelectedImage(0);
        if (data.sizes && data.sizes.length > 0) {
          const xsSize = data.sizes.find(s => s.size.toLowerCase() === 'xs');
          setSelectedSize(xsSize || data.sizes[0]);
        }

        // Fetch related products based on category or other criteria
        if (data.category && data.category._id) {
          const related = await customerProductApi.getAll(data.category._id.toString());
          // Filter out current product from related products
          const filteredRelated = related.filter(p => p._id !== data._id);
          setRelatedProducts(filteredRelated);
        }
        
        // You would also fetch user-specific favorite and rating status here if implemented on backend
        // For now, these are client-side placeholders.
        // const favoriteStatus = await customerAuthApi.getFavoriteStatus(id);
        // setIsFavorite(favoriteStatus);
        // const ratingStatus = await customerAuthApi.getUserRating(id);
        // setUserRating(ratingStatus);

      } catch (err) {
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const isLoggedIn = () => {
    return !!localStorage.getItem('token'); // Check for authentication token
  };

  const handleAddToCart = () => {
    if (!isLoggedIn()) {
      navigate('/profile', { state: { from: location } });
      return;
    }
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      alert('Please select a size.');
      return;
    }
    const sizeToUse = selectedSize ? selectedSize.size : 'default';
    const priceToUse = selectedSize ? selectedSize.price : product.price;
    if (product) {
      dispatch(addToCart({
        productId: product._id,
        quantity: 1,
        size: sizeToUse,
        price: priceToUse,
      }));
      alert(`${product.name} (Size: ${sizeToUse}) added to cart!`); // Custom modal
    }
  };

  const handleBuyNow = () => {
    if (!isLoggedIn()) {
      navigate('/profile', { state: { from: location } });
      return;
    }
    if (!selectedSize) {
      alert('Please select a size'); // Custom modal
      return;
    }
    if (product) {
      navigate(`/buynow/${product._id}`, { state: { product, selectedSize } });
    }
  };



  const handleRating = async (rating) => {
    if (!isLoggedIn()) {
      navigate('/profile', { state: { from: location } });
      return;
    }
    try {
      // Implement backend API for submitting product rating here
      // const response = await customerProductApi.submitRating(product._id, rating);
      setUserRating(rating); // Optimistic update
      alert(`You rated this product ${rating} stars!`); // Custom modal
    } catch (err) {
      alert("Failed to submit rating. Please try again."); // Custom modal
    }
  };

  const handleSubmitReview = async () => {
    if (!isLoggedIn()) {
      navigate('/profile', { state: { from: location } });
      return;
    }
    if (newReviewRating === 0) {
      alert('Please select a rating');
      return;
    }
    setSubmittingReview(true);
    try {
      const response = await customerProductApi.submitReview(product._id, { rating: newReviewRating, comment: newReview });
      setProduct(response);
      setReviews(response.reviews || []);
      setNewReview('');
      setNewReviewRating(0);
      alert('Review submitted successfully!');
    } catch (err) {
      alert("Failed to submit review. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!product) {
    return <div className="loading">Product not found.</div>;
  }

  return (
    <div className="product-view-container">
      <div className="product-main-section">
        {/* Left Side - Images */}
        <div className="product-images-section">
          <div className="main-image-container">
            <img
              src={`http://localhost:5000${product.images && product.images.length > 0 ? product.images[selectedImage] : product.imageUrl}`}
              alt={product.name}
              className="main-product-image"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x600/cccccc/000000?text=No+Image"; }}
            />
          </div>
          <div className="thumbnail-container">
            {product.images && product.images.length > 0 ? (
              product.images.map((image, index) => (
                <img
                  key={index}
                  src={`http://localhost:5000${image}`}
                  alt={`${product.name} ${index + 1}`}
                  className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/cccccc/000000?text=No+Image"; }}
                />
              ))
            ) : (
              // Fallback to single imageUrl if images array not available
              product.imageUrl && (
                <img
                  src={`http://localhost:5000${product.imageUrl}`}
                  alt={`${product.name} thumbnail`}
                  className={`thumbnail ${selectedImage === 0 ? 'active' : ''}`}
                  onClick={() => setSelectedImage(0)}
                  onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/cccccc/000000?text=No+Image"; }}
                />
              )
            )}
          </div>
        </div>

        {/* Right Side - Product Details */}
        <div className="product-details-section">
          <h1 className="product-title">{product.name}</h1> {/* Use product.name */}
          
          <p className="product-story">{product.description}</p> {/* Use product.description for story for now */}
          
          <div className="product-stats">
            {(product.views !== undefined && product.views >= 10) ? (
              <div className="views-count">{product.views} views</div>
            ) : null}
            {(userRating > 0 || (product.rating && product.rating > 0)) ? ( // Show user rating or product's average rating
              <div className="product-rating">
                <div className="stars">
                  {[...Array(5)].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={`star ${i < (userRating || product.rating) ? 'filled' : ''}`}
                    />
                  ))}
                </div>
                 {product.reviews && <span className="rating-text"> ({product.reviews.length} reviews)</span>}
              </div>
            ) : null}
          </div>

          <div className="product-price">
            <span className="price">
              {selectedSize ? selectedSize.price.toFixed(2) : product.price.toFixed(2)}
            </span> {/* Format price */}
          </div>

          <div className="size-section">
            <h3>Select Size</h3>
            <div className="size-options">
              {product.sizes && product.sizes.length > 0 ? (
                product.sizes.map(sizeObj => (
                  <button
                    key={sizeObj._id || sizeObj.size}
                    className={`size-btn ${selectedSize && selectedSize.size === sizeObj.size ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedSize(sizeObj);
                    }}
                  >
                    {sizeObj.size}
                  </button>
                ))
              ) : (
                <p>No sizes available.</p>
              )}
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
              onClick={() => {
                if (!localStorage.getItem('token')) {
                  navigate('/profile', { state: { from: location } });
                  return;
                }
                toggleFavorite(product._id);
              }}
            >
              <FaHeart /> 
            </button>
          </div>
        </div>
      </div>

      {/* Product Information Section */}
      <div className="product-info-section">
        <div className="info-tabs">
         {/* Add tabs here if needed, e.g., Description, Material, Reviews */}
        </div>

        <div className="info-content">
          <h3>About the Product</h3>
          <p>{product.description}</p> {/* Product's description */}

          <h4>Material & Care</h4>
          <p><strong>Material:</strong> {product.material}</p>
          <p><strong>Care Instructions:</strong> {product.care}</p>

          <h4>Product Details</h4>
          <ul>
            {product.details.map((detail, index) => (
              <li key={index}>{detail}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h3>Customer Reviews</h3>
        {reviews.length > 0 ? (
          <div className="reviews-list">
            {reviews.map((review, index) => (
              <div key={index} className="review-item">
                <div className="review-header">
                  <div className="review-stars">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={`star ${i < review.rating ? 'filled' : ''}`} />
                    ))}
                  </div>
                  <span className="review-user">{review.user?.name || 'Anonymous'}</span>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews yet. Be the first to review this product!</p>
        )}

        {isLoggedIn() && (
          <div className="submit-review">
            <h4>Write a Review</h4>
            <div className="review-form">
              <div className="rating-input">
                <label>Rating:</label>
                <div className="stars">
                  {[...Array(5)].map((_, i) => {
                    const starIndex = i + 1;
                    return (
                      <FaStar
                        key={i}
                        className={`star ${starIndex <= newReviewRating ? 'filled' : ''}`}
                        onClick={() => setNewReviewRating(starIndex)}
                        style={{ cursor: 'pointer' }}
                      />
                    );
                  })}
                </div>
              </div>
              <textarea
                placeholder="Write your review here..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                rows="4"
              />
              <button
                onClick={handleSubmitReview}
                disabled={submittingReview}
                className="submit-review-btn"
              >
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="related-products-section">
          <h3>You Might Also Like</h3>
          <div className="related-products-grid">
            {relatedProducts.slice(0, 4).map((relatedProduct) => (
              <div
                key={relatedProduct._id}
                className="related-product-card"
                onClick={() => navigate(`/product/${relatedProduct._id}`)}
              >
                <div className="related-product-image">
                  <img
                    src={`http://localhost:5000${relatedProduct.images && relatedProduct.images.length > 0 ? relatedProduct.images[0] : relatedProduct.imageUrl}`}
                    alt={relatedProduct.name}
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/200x200/cccccc/000000?text=No+Image"; }}
                  />
                </div>
                <div className="related-product-info">
                  <h4 className="related-product-name">{relatedProduct.name}</h4>
                  <div className="related-product-price">
                    <span className="price">₹{relatedProduct.price.toFixed(2)}</span>
                  </div>
                  {relatedProduct.rating && (
                    <div className="related-product-rating">
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`star ${i < relatedProduct.rating ? 'filled' : ''}`}
                          />
                        ))}
                      </div>
                      <span className="rating-text">({relatedProduct.reviews || 0})</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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