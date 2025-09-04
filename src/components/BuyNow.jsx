import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom'; // Added useParams
import '../styleSheets/buynowpage.css';
import { customerProductApi, customerOrderApi } from '../api/customer_api'; // Import customer APIs
import { useDispatch } from 'react-redux';
import { clearCart } from '../store/cartSlice';
import PaymentIntegration from './PaymentIntegration';

const BuyNow = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { productId: urlProductId } = useParams(); // Get product ID from URL if directly accessed
    const dispatch = useDispatch();

    const [currentStep, setCurrentStep] = useState(1);
    const [product, setProduct] = useState(null); // State to store product details
    const [selectedSize, setSelectedSize] = useState(location.state?.selectedSize || '');
    const [quantity, setQuantity] = useState(1);
    const [shippingCost, setShippingCost] = useState(0); // 0 for FREE
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [orderId, setOrderId] = useState(null);

    // Shipping Address State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('');

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                let currentProduct = location.state?.product;

                // If product not in location.state, try fetching from API using URL productId
                if (!currentProduct && urlProductId) {
                    currentProduct = await customerProductApi.getById(urlProductId);
                }

                if (currentProduct) {
                    setProduct(currentProduct);
                    // Set default size if available and not already selected
                    if (!selectedSize && currentProduct.sizes && currentProduct.sizes.length > 0) {
                        setSelectedSize(currentProduct.sizes[0]);
                    }
                } else {
                    setError("Product details not found. Redirecting to home.");
                    setTimeout(() => navigate('/'), 2000); // Redirect after message
                }
            } catch (err) {
                console.error("Failed to fetch product details for BuyNow:", err);
                setError("Failed to load product details. Please try again.");
                setTimeout(() => navigate('/'), 2000); // Redirect on error
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [location.state, navigate, urlProductId, selectedSize]); // Added selectedSize to dependencies

    // Render loading or error state early
    if (loading) {
        return <div className="buy-now-loading">Loading product details...</div>;
    }

    if (error || !product) {
        return <div className="buy-now-error">{error || "Product not available."}</div>;
    }

    // Now 'product' is guaranteed to be available
    const subtotal = product.price * quantity;
    const tax = Math.round(subtotal * 0.12);
    const total = subtotal + tax + shippingCost;

    const changeQuantity = (amount) => {
        setQuantity(prev => Math.max(1, Math.min(10, prev + amount)));
    };

    const handleStepNavigation = (step) => {
        setCurrentStep(step);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const completeOrder = async (e) => {
        e.preventDefault();
        // Here you would collect all order details (product, size, quantity, shipping, payment)
        const orderDetails = {
            orderItems: [{
                product: product._id,
                name: product.name,
                imageUrl: product.imageUrl,
                quantity: quantity,
                price: product.price,
            }],
            shippingAddress: {
                address: address,
                city: city,
                postalCode: postalCode,
                country: country,
            },
            paymentMethod,
            taxPrice: tax,
            shippingPrice: shippingCost,
            totalPrice: total,
        };

        try {
            // Call your backend API to place the order
            const response = await customerOrderApi.placeOrder(orderDetails);
            console.log("Order placed successfully:", response);
            setOrderId(response._id);

            if (paymentMethod === 'cod') {
                // For COD, directly show success modal
                dispatch(clearCart());
                setShowModal(true);
            } else {
                // For online payment, initiate Razorpay
                // The PaymentIntegration component will handle the payment
            }
        } catch (err) {
            console.error("Failed to place order:", err);
            setError("Failed to place order. Please try again.");
        }
    };

    const handlePaymentSuccess = () => {
        dispatch(clearCart());
        setShowModal(true);
    };

    const handlePaymentError = (error) => {
        setError(error);
    };

    const closeModal = () => {
        setShowModal(false);
        navigate('/'); // Redirect to home after closing modal
    };

    const renderStepIndicator = () => (
        <div className="progress-indicator-container">
            <div className="progress-indicator">
                {[1, 2, 3].map((step, index) => (
                    <React.Fragment key={step}>
                        <div className={`step-indicator ${currentStep === step ? 'active' : ''} ${currentStep > step ? 'completed' : ''}`}>
                            {currentStep > step ? '✓' : step}
                        </div>
                        {index < 2 && <div className="step-connector"></div>}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );

    return (
        <div className="buy-now-container">
            <main className="container page-content">
                {renderStepIndicator()}

                {/* Step 1: Product Selection */}
                {currentStep === 1 && (
                    <div className="checkout-step active">
                        <div className="step-grid">
                            <div className="product-image-section">
                                <div className="product-image-bg">
                                    {/* Using product.imageUrl from backend */}
                                    <img
                                        src={`http://localhost:5000${product.imageUrl}`}
                                        alt={product.name}
                                        className="product-image"
                                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/400x400/cccccc/000000?text=No+Image"; }}
                                    />
                                </div>
                            </div>
                            <div className="product-details-section">
                                <h1 className="product-title gradient-text">{product.name}</h1> {/* Use product.name */}
                                <p className="product-description">{product.description}</p>
                                <div className="product-price-info">
                                    <span className="price">₹{product.price.toFixed(2)}</span> {/* Use product.price */}
                                    {/* Removed original_price as it's not in your backend product schema */}
                                </div>
                                <div className="product-options">
                                    <h3 className="options-title">Select Size</h3>
                                    <div className="size-selector">
                                        {product.sizes && product.sizes.length > 0 ? (
                                            product.sizes.map(size => (
                                                <div key={size} className={`size-option glass-card ${selectedSize === size ? 'selected' : ''}`} onClick={() => setSelectedSize(size)}>
                                                    {size}
                                                </div>
                                            ))
                                        ) : (
                                            <p>No sizes available.</p>
                                        )}
                                    </div>
                                </div>
                                <div className="product-options">
                                    <h3 className="options-title">Quantity</h3>
                                    <div className="quantity-selector">
                                        <button className="quantity-btn glass-card" onClick={() => changeQuantity(-1)}>-</button>
                                        <span className="quantity-display">{quantity}</span>
                                        <button className="quantity-btn glass-card" onClick={() => changeQuantity(1)}>+</button>
                                    </div>
                                </div>
                                <div className="action-buttons">
                                    <button
                                        className="btn-unique full-width"
                                        onClick={() => handleStepNavigation(2)}
                                        disabled={!selectedSize} // Disable if no size is selected
                                    >
                                        <span>Continue to Checkout</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: Shipping Information */}
                {currentStep === 2 && (
                    <div className="checkout-step active">
                        <div className="step-centered">
                            <div className="step-header">
                                <h2 className="step-title gradient-text">Shipping Information</h2>
                                <p className="step-subtitle">Please provide your delivery details</p>
                            </div>
                            <div className="step-grid-shipping">
                                <div className="form-container">
                                    <div className="morphism-card form-card">
                                        <form className="form-content">
                                            <div className="form-grid-two-col">
                                                <div>
                                                    <label className="form-label">First Name *</label>
                                                    <input type="text" required className="form-input" placeholder="Enter first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                                                </div>
                                                <div>
                                                    <label className="form-label">Last Name *</label>
                                                    <input type="text" required className="form-input" placeholder="Enter last name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="form-label">Address Line 1 *</label>
                                                <input type="text" required className="form-input" placeholder="House/Flat number, Street name" value={address} onChange={(e) => setAddress(e.target.value)} />
                                            </div>
                                            <div className="form-grid-two-col">
                                                <div>
                                                    <label className="form-label">City *</label>
                                                    <input type="text" required className="form-input" placeholder="Enter city" value={city} onChange={(e) => setCity(e.target.value)} />
                                                </div>
                                                <div>
                                                    <label className="form-label">Postal Code *</label>
                                                    <input type="text" required className="form-input" placeholder="Enter postal code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="form-label">Country *</label>
                                                <input type="text" required className="form-input" placeholder="Enter country" value={country} onChange={(e) => setCountry(e.target.value)} />
                                            </div>
                                            <div className="delivery-options">
                                                <h4 className="options-title">Delivery Options</h4>
                                                <div className="radio-group">
                                                    <label className={`payment-option glass-card ${shippingCost === 0 ? 'selected' : ''}`}>
                                                        <input type="radio" name="shipping" checked={shippingCost === 0} onChange={() => setShippingCost(0)} />
                                                        <div className="option-details">
                                                            <p>Standard Delivery</p>
                                                            <small>5-7 business days</small>

                                                        </div>
                                                        <span className="option-price free">FREE</span>
                                                    </label>
                                                    <label className={`payment-option glass-card ${shippingCost === 99 ? 'selected' : ''}`}>
                                                        <input type="radio" name="shipping" checked={shippingCost === 99} onChange={() => setShippingCost(99)} />
                                                        <div className="option-details">
                                                            <p>Express Delivery</p>
                                                            <small>2-3 business days</small>
                                                        </div>
                                                        <span className="option-price">₹99</span>
                                                    </label>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                                <aside className="sidebar">
                                    <div className="morphism-card summary-card">
                                        <h4 className="summary-title">Order Summary</h4>
                                        <div className="summary-line-items">
                                            <div className="summary-item"><p>Subtotal</p> <span>₹{subtotal.toFixed(2)}</span></div>
                                            <div className="summary-item"><p>Shipping</p> <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span></div>
                                            <div className="summary-item"><p>Tax</p> <span>₹{tax.toFixed(2)}</span></div>
                                            <div className="summary-total">
                                                <p>Total</p> <span className="gradient-text">₹{total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </aside>
                            </div>
                            <div className="nav-buttons">
                                <button className="glass-card nav-btn" onClick={() => handleStepNavigation(1)}>← Back to Product</button>
                                <button className="btn-unique nav-btn" onClick={() => handleStepNavigation(3)}><span>Continue to Payment →</span></button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Payment */}
                {currentStep === 3 && (
                    <div className="checkout-step active">
                        <div className="step-centered">
                            <div className="step-header">
                                <h2 className="step-title gradient-text">Payment</h2>
                            </div>
                            <div className="step-grid-shipping">
                                <div className="form-container">
                                    <div className="morphism-card form-card">
                                        <h4 className="options-title">Payment Methods</h4>
                                        <div className="radio-group payment-methods">
                                            {['card', 'upi', 'wallet', 'cod'].map(method => (
                                                <label key={method} className={`payment-option glass-card ${paymentMethod === method ? 'selected' : ''}`}>
                                                    <input type="radio" name="payment" value={method} checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                                                    <span className="payment-icon">{method === 'card' ? '💳' : method === 'upi' ? '📱' : method === 'wallet' ? '👛' : '💰'}</span>
                                                    <span className="payment-label">{method.charAt(0).toUpperCase() + method.slice(1).replace('cod', 'Cash on Delivery')}</span>
                                                </label>
                                            ))}
                                        </div>
                                        {paymentMethod === 'card' && (
                                            <div className="card-form">
                                                <div>
                                                    <label className="form-label">Card Number</label>
                                                    <input type="text" className="form-input" placeholder="1234 5678 9012 3456" />
                                                </div>
                                                <div className="form-grid-two-col">
                                                    <div>
                                                        <label className="form-label">Expiry Date</label>
                                                        <input type="text" className="form-input" placeholder="MM/YY" />
                                                    </div>
                                                    <div>
                                                        <label className="form-label">CVV</label>
                                                        <input type="text" className="form-input" placeholder="123" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <aside className="sidebar">
                                    <div className="morphism-card summary-card">
                                        <h4 className="summary-title">Final Order</h4>
                                        <div className="summary-line-items">
                                            <div className="summary-item"><p>Subtotal</p> <span>₹{subtotal.toFixed(2)}</span></div>
                                            <div className="summary-item"><p>Shipping</p> <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}</span></div>
                                            <div className="summary-item"><p>Tax</p> <span>₹{tax.toFixed(2)}</span></div>
                                            <div className="summary-total">
                                                <p>Total</p> <span className="gradient-text">₹{total.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <button className="btn-unique full-width" onClick={completeOrder}><span>Complete Order</span></button>
                                    </div>
                                </aside>
                            </div>
                            <div className="nav-buttons single-button">
                                <button className="glass-card nav-btn" onClick={() => handleStepNavigation(2)}>← Back to Shipping</button>
                            </div>
                        </div>
                    </div>
                )}

            </main>

            {/* Payment Integration */}
            {orderId && paymentMethod !== 'cod' && (
                <PaymentIntegration
                    orderDetails={{
                        _id: orderId,
                        totalPrice: total,
                        userEmail: 'user@example.com', // You should get this from user state
                    }}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                />
            )}

            {/* Order Confirmation Modal */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="morphism-card modal-content">
                        <div className="modal-icon">🎉</div>
                        <h3 className="modal-title gradient-text">Order Confirmed!</h3>
                        <p className="modal-text">Thank you for your purchase! Your order will be processed shortly.</p>
                        <button className="btn-unique full-width" onClick={closeModal}><span>Continue Shopping</span></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BuyNow;