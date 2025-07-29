import React, { useEffect, useState } from "react";
import "../styleSheets/collections.css";
import { useLocation } from "react-router-dom";
import Varsham from "../assests/Images/varsham.jpg";
import Love from "../assests/Images/love.jpeg";
import Sunflower from "../assests/Images/sunflower.jpeg";


const products = [
  // Short Kurtis
  {
    id: 1,
    title: "Floral Bloom Essence",
    description: "Beautiful floral patterns perfect for casual wear with intricate embroidery",
    price: "₹1299",
    category: "Short",
    image: Varsham,
  },
  {
    id: 2,
    title: "Embroidered Elegance",
    description: "Delicate embroidery with modern cut and premium cotton fabric",
    price: "₹1599",
    category: "Short",
    image: Varsham,
  },

  // Long Kurtis
  {
    id: 3,
    title: "Royal Radiance",
    description: "Long royal kurti with zardosi thread work and elegant drape",
    price: "₹1999",
    category: "Long",
    image: Love,
  },
  {
    id: 4,
    title: "Elegance Trail",
    description: "Full-length kurti with floral prints and a soft flowing hem",
    price: "₹1799",
    category: "Long",
    image : Love,
  },

  // Anarkali
  {
    id: 5,
    title: "Anarkali Aura",
    description: "Graceful Anarkali kurti with sequin embroidery and churidar sleeves",
    price: "₹2199",
    category: "Anarkali",
    image: Sunflower,
  },
  {
    id: 6,
    title: "Twilight Tradition",
    description: "Classic Anarkali cut with gold foil prints and pastel tones",
    price: "₹2099",
    category: "Anarkali",
    image: Sunflower,
  },
];


const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Collections = () => {
const query = useQuery();
  const initialCategory = query.get("category") || "All";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);
  return (
    <div className="collection-container">
      <header className="hero-section">
        <h1 className="title">Our Collections</h1>
        <p className="subtitle">Explore our exclusive range of handcrafted pieces, each designed to celebrate individuality and style.</p>
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
               <img src={item.image} alt={item.title} className="product-image" />
            <h3 className="product-name">{item.title}</h3>
            <p className="description">{item.description}</p>
            <div className="footer">
              <span className="price">{item.price}</span>
              <button className="view-btn">View</button>
              <button className="add-btn">Add to Cart</button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Collections;
