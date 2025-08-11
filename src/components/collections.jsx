import React, { useEffect, useState } from "react";
import "../styleSheets/collections.css";
import { useLocation, useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Collections = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const query = useQuery();
  const navigate = useNavigate();
  const initialCategory = query.get("category") || "All";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Failed to fetch products", err));
  }, []);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const handleViewClick = (productId) => {
    // First increment the view count
    fetch(`http://localhost:5000/api/products/${productId}/view`, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts((prevProducts) =>
            prevProducts.map((product) =>
              product.id === productId
                ? { ...product, views: data.views }
                : product
            )
          );
          // Then navigate to the product view page
          navigate(`/product/${productId}`);
        }
      })
      .catch((err) => console.error("Failed to increment view", err));
  };

  return (
    <div className="collection-container">
      <header className="hero-section">
        <h1 className="title">Our Collections</h1>
        <p className="subtitle">
          Explore our exclusive range of handcrafted pieces, each designed to
          celebrate individuality and style.
        </p>
        <div className="tabs">
          {["All", "Short", "Long", "Anarkali"].map((cat) => (
            <button
              key={cat}
              className={`tab ${selectedCategory === cat ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <section className="products-grid">
        {filteredProducts.map((item) => (
          <div className="product-card" key={item.id}>
            <img
              src={item.images && item.images.length > 0 ? item.images[0] : ''}
              alt={item.title}
              className="product-image"
            />
            <h3 className="product-name">{item.title}</h3>
            <p className="description">{item.description}</p>
            <div className="product-stats">
              {console.log('Product:', item.title, 'Views:', item.views, 'Rating:', item.rating)}
              {(item.views >= 10) ? (
                <div className="views">
                  <span>{item.views} views</span>
                </div>
              ) : null}
              {false /* Hide ratings until user rates */ ? (
                 <div className="rating">
                  {[...Array(Math.floor(item.rating))].map((_, i) => (
                    <FaStar 
                      key={i} 
                      className={`star ${i < Math.floor(item.rating) ? 'filled' : ''}`}
                    />
                  ))}
                  <span className="rating-text">{item.rating} ({item.reviews} reviews)</span>
                </div>
              ) : null}
            </div>
            <div className="footer">
              <span className="price">{item.price}</span>
              <button 
                className="view-btn" 
                onClick={() => handleViewClick(item.id)}
              >
                View
              </button>
              <button className="add-btn" onClick={() => addToCart(item)}>
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Collections;
