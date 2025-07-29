import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styleSheets/home.css';
import Varsham from "../assests/Images/varsham.jpg";
import Love from "../assests/Images/love.jpeg";
import Sunflower from "../assests/Images/sunflower.jpeg";

const Home = () => {
  const navigate = useNavigate();

  const goToCategory = (category) => {
    navigate(`/collections?category=${category}`);
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
            <img src={Varsham} alt="Crafted Piece" className="crafted-image" />
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
          <div className="image-box" onClick={() => goToCategory("Short")} style={{ cursor: 'pointer' }}>
            <img src={Varsham} alt="Signature Piece 1" className="signature-image" />
            <div className="overlay-text">
              <h2>Short Kurthis</h2>
              <p>Perfect for modern lifestyle with traditional charm</p>
            </div>
          </div>

          <div className="image-box" onClick={() => goToCategory("Long")} style={{ cursor: 'pointer' }}>
            <img src={Love} alt="Signature Piece 2" className="signature-image" />
            <div className="overlay-text">
              <h2>Long Kurtis</h2>
              <p>Graceful silhouettes for elegant occasions</p>
            </div>
          </div>

          <div className="image-box" onClick={() => goToCategory("Anarkali")} style={{ cursor: 'pointer' }}>
            <img src={Sunflower} alt="Signature Piece 3" className="signature-image" />
            <div className="overlay-text">
              <h2>Flare Kurtis</h2>
              <p>Timeless flare with contemporary sophistication</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
