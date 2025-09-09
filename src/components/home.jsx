import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styleSheets/home.css';
import { customerCategoryApi } from '../api/customer_api'; // Adjust path if necessary

const Home = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      try {
        const response = await customerCategoryApi.getAll();
        setCategories(response);
      } catch (err) {
        // Error handled silently or could add user notification
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);




  const goToCategory = (categoryName) => {
    navigate(`/collections?category=${categoryName}`);
  };

  return (
    <div className="home-parent-container">
      <div className="home-container">
        <div className="left-section">
          <h1 className="brand-name">Savi Sri</h1>
          <h2 className="tagline moving-text">Wear Your Light</h2>
          <p className="subtag">Because You Deserve to Feel Divine.</p>

          <div className="button-group">
            <button onClick={() => goToCategory("All")}>Explore Collections</button>
            <button onClick={() => navigate('/about-us')}>Our Story</button>
          </div>
        </div>

        <div className="right-section">
          <div className="craft-image-box" onClick={() => goToCategory("All")} style={{ cursor: 'pointer' }}>
            {/* Using a placeholder for now, you might want to fetch a specific product image */}
            <img src="/images/varsham.jpg" alt="Crafted Piece" className="crafted-image" />
            <div className="overlay-text">
              <h2>Handcrafted Excellence</h2>
              <p>Every piece tells a story of tradition and innovation.</p>
            </div>
          </div>
        </div>
      </div>

     

      <div className="signature-collection-container">
        <h1 className="section-heading">Signature Collection</h1>
        <h3 style={{ color: 'darkgoldenrod', fontStyle: 'italic', fontSize: '30px' }}>
          Discover our three distinctive styles, each crafted with passion and precision
        </h3>
        <div className="signature-cards-wrapper">
          {loadingCategories ? (
            <p>Loading categories...</p>
          ) : (
            <>
              {/* These links now use the goToCategory function which can send category name */}
              <div className="image-box" onClick={() => goToCategory("Short")} style={{ cursor: 'pointer' }}>
                <img src="/images/varsham.jpg" alt="Signature Piece 1" className="signature-image" />
                <div className="overlay-text">
                  <h2>Short Kurtis</h2>
                  <p>Perfect for modern lifestyle with traditional charm</p>
                </div>
              </div>

              <div className="image-box" onClick={() => goToCategory("Long")} style={{ cursor: 'pointer' }}>
                <img src="/images/love.jpeg" alt="Signature Piece 2" className="signature-image" />
                <div className="overlay-text">
                  <h2>Long Kurtis</h2>
                  <p>Graceful silhouettes for elegant occasions</p>
                </div>
              </div>

              <div className="image-box" onClick={() => goToCategory("Anarkali")} style={{ cursor: 'pointer' }}>
                <img src="/images/sunflower.jpeg" alt="Signature Piece 3" className="signature-image" />
                <div className="overlay-text">
                  <h2>Flare Kurtis</h2>
                  <p>Timeless flare with contemporary sophistication</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Color Analysis Section */}
      {/* <div className="color-analysis-section">
        <h1 className="color-analysis-heading">Discover Your Perfect Colors</h1>
        <p className="color-analysis-description">
          Get personalized color recommendations based on your skin tone, hair color, and eye color.
          Find the shades that make you glow!
        </p>
        <button onClick={() => navigate('/color-analysis')} className="color-analysis-btn">
          Get My Color Analysis
        </button>
      </div> */}
    </div>
  );
};

export default Home;
