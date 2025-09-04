import React from 'react';
import '../styleSheets/aboutUs.css';

const AboutUs = () => {
  return (
    <div className="aboutUs-container">
      <section className="hero-banner">
        <h1 className="headline">Crafted to Celebrate You</h1>
        <p className="subheadline">Where tradition meets timeless fashion — for the woman who owns her light.</p>
      </section>

      <section className="philosophy-section">
        <h2>Our Philosophy</h2>
        <p>
          At <strong>Savi Sri</strong>, we believe that clothing is more than a statement — it’s a reflection of your essence. Each piece in our collection is designed to honor individuality while embracing the heritage of Indian craftsmanship.
        </p>
        <p>
          We’re here for the dreamers who dance between cultures, who crave comfort without compromising grace, and who see clothing not just as fabric, but as an extension of self-worth.
        </p>
      </section>

      <section className="craftsmanship-section">
        <h2>Handcrafted with Intention</h2>
        <p>
          Our creations begin with inspiration drawn from nature, heritage, and cinematic elegance. From hand-painted fabrics to delicate embroidery, each kurti is infused with stories, energy, and care.
        </p>
        <p>
          Every detail — every thread — is a celebration of the women who wear them. Our artisans combine timeless techniques with modern silhouettes, delivering garments that feel as empowering as they look.
        </p>
      </section>

      <section className="difference-section">
        <h2>What Sets Us Apart</h2>
        <ul className="pillars-list">
          <li><strong>✨ Thoughtful Design:</strong> Fusion of tradition and trend with flattering fits.</li>
          <li><strong>🖌️ Hand-Painted Stories:</strong> No mass prints — only soul in every stroke.</li>
          <li><strong>🧵 Limited Editions:</strong> Because beauty should never feel ordinary.</li>
          <li><strong>🌿 Indian Roots, Modern Flow:</strong> Ethically crafted with comfort-focused Indian fabrics.</li>
        </ul>
      </section>

      <section className="vision-section">
        <h2>Our Vision</h2>
        <p>
          To redefine ethnic wear with authenticity and artistry. To ensure every woman — no matter her size, age, or background — feels confident, seen, and celebrated when she wears Savi Sri.
        </p>
        <p>
          We’re not just building a brand. We’re building a movement — one outfit at a time.
        </p>
      </section>

      <section className="cta-section">
        <p>Thank you for letting us be part of your journey. Welcome to the Savi Sri family.</p>
        <p className="signature">— With love, the Savi Sri Team</p>
      </section>
    </div>
  );
};

export default AboutUs;
