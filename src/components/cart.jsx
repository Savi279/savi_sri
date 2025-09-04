import React, { useEffect } from "react"; // Import useEffect
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart, updateCartItemQuantity } from "../store/cartSlice"; // Import fetchCart
import { selectCartItems, selectCartTotal } from "../store/cartSlice";
import "../styleSheets/cart.css";
import { FaStar } from "react-icons/fa";
// No direct API calls here, dispatching Redux thunks

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector(selectCartItems);
  const cartTotal = useSelector(selectCartTotal);

  useEffect(() => {
    // Fetch cart on component mount for logged-in users
    // You might want to conditionally dispatch this based on user authentication status
    dispatch(fetchCart()); 
  }, [dispatch]);

  const incrementQuantity = (productId, size) => {
    const item = cartItems.find(item => item.product._id === productId && item.size === size);
    if (item) {
      dispatch(updateCartItemQuantity({ productId, size, quantity: item.quantity + 1 }));
    }
  };

  const decrementQuantity = (productId, size) => {
    const item = cartItems.find(item => item.product._id === productId && item.size === size);
    if (item && item.quantity > 1) {
      dispatch(updateCartItemQuantity({ productId, size, quantity: item.quantity - 1 }));
    } else {
      dispatch(removeFromCart({ productId, size }));
    }
  };

  const removeItem = (productId, size) => {
    dispatch(removeFromCart({ productId, size }));
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) {
      // alert("Your cart is empty!"); // Consider a custom modal
      return;
    }

    try {
      // In a real application, you'd send cartItems to your backend for processing.
      // This is a simplified example.
      // const orderData = {
      //   items: cartItems.map(item => ({
      //     productId: item._id, 
      //     quantity: item.quantity,
      //     priceAtTimeOfPurchase: item.price, 
      //   })),
      //   totalAmount: cartTotal,
      // };
      // const response = await customerOrderApi.placeOrder(orderData);
      // console.log("Order placed successfully:", response);

      // For now, simulate checkout success and redirect to BuyNow for the first item
      // In a real app, you'd integrate with a full checkout flow, possibly passing the entire cart.
      const validCartItems = cartItems.filter(item => item.product);
      const firstCartItem = validCartItems[0];
      if (firstCartItem) {
        // Clear cart after "successful" checkout initiation (if backend confirms order)
        // dispatch(clearCart()); // Clear cart in Redux
        navigate(`/buynow/${firstCartItem.product._id}`, { // Pass product ID in URL
          state: {
            product: {
              ...firstCartItem.product,
              // Ensure product has all needed fields for BuyNow from Redux item
              name: firstCartItem.product.name,
              imageUrl: firstCartItem.product.image,
              sizes: ['S', 'M', 'L', 'XL'] // Example sizes if not stored in cart item
            },
            selectedSize: 'M', // Example default size
            quantity: firstCartItem.quantity
          }
        });
      } else {
        // alert("Cart is empty!"); // Consider a custom modal
      }
      
    } catch (error) {
      console.error("Checkout failed:", error);
      // alert("Checkout failed. Please try again."); // Consider a custom modal
    }
  };

  const subtotal = cartTotal;

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
          {cartItems.filter(item => item.product).map((item, index) => (
            <div className={`cart-item card-${index + 1}`} key={`${item.product._id}-${item.size}`}>
              <img
                src={`http://localhost:5000${item.product.image}`}
                alt={item.product.name}
                className="cart-item-image"
                onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/cccccc/000000?text=No+Image"; }}
              />
              <div className="cart-item-details">
                <h3 className="item-name">{item.product.name}</h3>
                <p className="item-description">{item.product.tagline || item.product.description}</p>
                <div className="product-stats">
                  {item.product.views >= 10 && (
                    <div className="views">
                      <span>{item.product.views} views</span>
                    </div>
                  )}
                  {false && (
                    <div className="rating">
                      {[...Array(Math.floor(item.product.rating))].map((_, i) => (
                        <FaStar key={i} color="#b38b2e" />
                      ))}
                      <span> ({item.product.reviews || 0} reviews)</span>
                    </div>
                  )}
                </div>
                <div className="cart-item-controls">
                  <button onClick={() => decrementQuantity(item.product._id, item.size)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => incrementQuantity(item.product._id, item.size)}>+</button>
                  <button
                    onClick={() => removeItem(item.product._id, item.size)}
                    className="remove-btn"
                    title="Remove item"
                  >
                    🗑️
                  </button>
                </div>
                <p className="cart-item-price">
                  ₹{(Number(item.product.price) * item.quantity).toFixed(0)}
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
              <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout 🎉</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;