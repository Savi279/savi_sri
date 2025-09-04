import React, { useEffect, useState } from "react";
import "../styleSheets/collections.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToFavorites, selectIsFavorite } from "../store/favoritesSlice";
import { FaStar, FaRegStar } from "react-icons/fa";
import { customerProductApi, customerCategoryApi } from '../api/customer_api'; // Adjust path if necessary
import { selectIsAuthenticated } from "../store/userSlice";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Collections = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const query = useQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Get favorites state for all products
  const favorites = useSelector(state => state.favorites.items);
  
  const initialCategoryParam = query.get("category");
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryParam || "All");

  useEffect(() => {
    setSelectedCategory(initialCategoryParam || "All");
  }, [initialCategoryParam]);

  useEffect(() => {
    const fetchCollectionData = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchedCategories = await customerCategoryApi.getAll();
        setCategories(["All", ...fetchedCategories.map(cat => cat.name)]);

        let categoryIdToFetch = null;
        if (selectedCategory && selectedCategory !== "All") {
          const matchedCategory = fetchedCategories.find(cat => cat.name === selectedCategory);
          if (matchedCategory) {
            categoryIdToFetch = matchedCategory._id;
          }
        }
        
        const fetchedProducts = await customerProductApi.getAll(categoryIdToFetch);
        setProducts(fetchedProducts);

      } catch (err) {
        console.error("Failed to fetch collections data", err);
        setError("Failed to load products or categories. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCollectionData();
  }, [selectedCategory]);

  const displayedProducts = products;

  const handleViewClick = async (productId) => {
    console.log('handleViewClick called with', productId);
    try {
      // Increment the view count via API
      const response = await customerProductApi.incrementView(productId);

      if (response && response.views !== undefined) {
        // Update the products state with the new view count
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === productId
              ? { ...product, views: response.views }
              : product
          )
        );
      }
      // Then navigate to the product view page
      navigate(`/product/${productId}`);
    } catch (err) {
      console.error("Failed to increment view or navigate", err);
      // Optionally show an error message to the user
    }
  };

  const handleAddToFavorites = async (item) => {
    console.log('handleAddToFavorites called with', item);
    if (!isAuthenticated) {
      alert("Please login to add items to your favorites.");
      navigate('/profile');
      return;
    }
    try {
      await dispatch(addToFavorites(item._id)).unwrap();
      alert(`${item.name} added to favorites!`);
    } catch (error) {
      console.log('addToFavorites error', error);
      alert(`Failed to add to favorites: ${error}`);
    }
  };

  if (loading) return <div className="loading-message">Loading collections...</div>;
  if (error) return <div className="error-message">{error}</div>;


  return (
    <div className="collection-container">
      <header className="hero-section">
        <h1 className="title">Our Collections</h1>
        <p className="subtitle">
          Explore our exclusive range of handcrafted pieces, each designed to
          celebrate individuality and style.
        </p>
        <div className="tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`tab ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => {
                setSelectedCategory(cat);
                navigate(`/collections?category=${cat}`);
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <section className="products-grid">
        {displayedProducts.length === 0 ? (
          <p className="no-products-found">No products found in this category.</p>
        ) : (
          displayedProducts.map((item) => (
            <div className="product-card" key={item._id}>
              <img
                src={`http://localhost:5000${item.imageUrl}`}
                alt={item.name}
                className="product-image"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/200x200/cccccc/000000?text=No+Image"; }}
              />
              <h3 className="product-name">{item.name}</h3>
              <p className="description">{item.tagline || item.description}</p>
              <div className="product-stats">
                {(item.views !== undefined && item.views >= 10) ? (
                  <div className="views">
                    <span>{item.views} views</span>
                  </div>
                ) : null}
                {false && item.rating && ( 
                   <div className="rating">
                    {[...Array(Math.floor(item.rating))].map((_, i) => (
                      <FaStar 
                        key={i} 
                        className={`star ${i < Math.floor(item.rating) ? 'filled' : ''}`}
                      />
                    ))}
                    <span className="rating-text">{item.rating} ({item.reviews} reviews)</span>
                  </div>
                )}
              </div>
              <div className="footer">
                <span className="price">{item.price.toFixed(2)}</span>
                <button 
                  className="view-btn" 
                  onClick={() => handleViewClick(item._id)}
                >
                  View
                </button>
                <button
                  className={`favorites-btn ${favorites.some(fav => fav._id === item._id) ? 'favorited' : ''}`}
                  onClick={() => handleAddToFavorites(item)}
                >
                  {favorites.some(fav => fav._id === item._id) ? <FaStar /> : <FaRegStar />}
                  {favorites.some(fav => fav._id === item._id) ? 'Favorited' : 'Add to Favorites'}
                </button>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Collections;
