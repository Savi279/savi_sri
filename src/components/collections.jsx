import React, { useEffect, useState } from "react";
import "../styleSheets/collections.css";
import { useLocation } from "react-router-dom";
import { FaStar } from "react-icons/fa";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Collections = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const query = useQuery();
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

  useEffect(() => {
    filteredProducts.forEach((product) => {
      fetch(`http://localhost:5000/api/products/${product.id}/view`, {
        method: "POST",
      }).catch((err) => console.error("Failed to increment view", err));
    });
  }, [filteredProducts]);

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
              src={item.image}
              alt={item.title}
              className="product-image"
            />
            <h3 className="product-name">{item.title}</h3>
            <p className="description">{item.description}</p>
            <div className="rating">
              {[...Array(item.rating)].map((_, i) => (
                <FaStar key={i} color="#b38b2e" />
              ))}
              <span> ({item.views} reviews)</span>
            </div>
            <div className="footer">
              <span className="price">{item.price}</span>
              <button className="view-btn">View</button>
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
