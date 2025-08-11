import React from "react";
import { Link } from "react-router-dom";
import "../styleSheets/cart.css";
import { FaStar } from "react-icons/fa";

const Cart = ({ cartItems, setCartItems }) => {
  const incrementQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (id) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === id && item.quantity > 1
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((acc, item) => {
    const priceNumber = Number(item.price.replace(/[^0-9.-]+/g, ""));
    return acc + priceNumber * item.quantity;
  }, 0);

  return (
    <div className="cart-container">
      <h1 className="cart-title">Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <div className="empty-cart-icon bouncing-cart">🛒</div>

          <h2>Your cart is empty</h2>
          <p>Add some beautiful kurtis to get started!</p>
          <Link to="/collections" className="continue-shopping-btn filled">
            Continue Shopping ✨
          </Link>
        </div>
      ) : (
        <>
          {cartItems.map((item, index) => (
            <div className={`cart-item card-${index + 1}`} key={item.id}>
              <img
                src={item.image}
                alt={item.title}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h3 className="item-name">{item.title}</h3>
                <p className="item-description">{item.description}</p>
                <div className="product-stats">
                  {item.views >= 10 && (
                    <div className="views">
                      <span>{item.views} views</span>
                    </div>
                  )}
                  {false /* Hide ratings until user rates */ && (
                    <div className="rating">
                      {[...Array(Math.floor(item.rating))].map((_, i) => (
                        <FaStar key={i} color="#b38b2e" />
                      ))}
                      <span> ({item.reviews || 0} reviews)</span>
                    </div>
                  )}
                </div>
                <div className="cart-item-controls">
                  <button onClick={() => decrementQuantity(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => incrementQuantity(item.id)}>+</button>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="remove-btn"
                    title="Remove item"
                  >
                    🗑️
                  </button>
                </div>
                <p className="cart-item-price">
                  ₹{(Number(item.price.replace(/[^0-9.-]+/g, "")) * item.quantity).toFixed(0)}
                </p>
              </div>
            </div>
          ))}
          <div className="cart-summary">
            <div className="cart-subtotal">
              <h2>Subtotal:</h2>
              <h2>₹{subtotal.toFixed(0)}</h2>
            </div>
            <div className="cart-actions">
              <Link to="/collections" className="continue-shopping-btn">
                Continue Shopping
              </Link>
              <button className="checkout-btn">Proceed to Checkout 🎉</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
