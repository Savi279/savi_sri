import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styleSheets/buynowpage.css';

const BuyNow = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [currentStep, setCurrentStep] = useState(1);
    // Initialize state with a placeholder if location.state is not available yet
    const [selectedSize, setSelectedSize] = useState(location.state?.selectedSize || ''); 
    const [quantity, setQuantity] = useState(1);
    const [shippingCost, setShippingCost] = useState(0); // 0 for FREE
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [showModal, setShowModal] = useState(false);

    // This effect now safely handles the redirect after the component has rendered.
    useEffect(() => {
        if (!location.state || !location.state.product) {
            navigate('/');
        }
    }, [location.state, navigate]);

    // FIX 2: The conditional "early return" is now placed AFTER all hooks have been called.
    if (!location.state || !location.state.product) {
        return null; // Render nothing while the useEffect above redirects
    }

    // Product data is now safely destructured after the check
    const { product } = location.state;
    
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

    const completeOrder = (e) => {
        e.preventDefault();
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        navigate('/');
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
    
    // The rest of the component remains the same...
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
                                    <img src={product.images[0]} alt={product.title} className="product-image"/>
                                </div>
                            </div>
                            <div className="product-details-section">
                                <h1 className="product-title gradient-text">{product.title}</h1>
                                <p className="product-description">{product.description}</p>
                                <div className="product-price-info">
                                    <span className="price">{product.price.toLocaleString()}</span>
                                    {product.original_price && <span className="original-price">₹{product.original_price.toLocaleString()}</span>}
                                </div>
                                <div className="product-options">
                                    <h3 className="options-title">Select Size</h3>
                                    <div className="size-selector">
                                        {product.sizes.map(size => (
                                            <div key={size} className={`size-option glass-card ${selectedSize === size ? 'selected' : ''}`} onClick={() => setSelectedSize(size)}>
                                                {size}
                                            </div>
                                        ))}
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
                                    <button className="btn-unique full-width" onClick={() => handleStepNavigation(2)}>
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
                                                    <input type="text" required className="form-input" placeholder="Enter first name"/>
                                                </div>
                                                <div>
                                                    <label className="form-label">Last Name *</label>
                                                    <input type="text" required className="form-input" placeholder="Enter last name"/>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="form-label">Address Line 1 *</label>
                                                <input type="text" required className="form-input" placeholder="House/Flat number, Street name"/>
                                            </div>
                                            <div className="delivery-options">
                                                <h4 className="options-title">Delivery Options</h4>
                                                <div className="radio-group">
                                                    <label className={`payment-option glass-card ${shippingCost === 0 ? 'selected' : ''}`}>
                                                        <input type="radio" name="shipping" checked={shippingCost === 0} onChange={() => setShippingCost(0)}/>
                                                        <div className="option-details">
                                                            <p>Standard Delivery</p>
                                                            <small>5-7 business days</small>
                                                        </div>
                                                        <span className="option-price free">FREE</span>
                                                    </label>
                                                    <label className={`payment-option glass-card ${shippingCost === 99 ? 'selected' : ''}`}>
                                                        <input type="radio" name="shipping" checked={shippingCost === 99} onChange={() => setShippingCost(99)}/>
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
                                            <div className="summary-item"><p>Subtotal</p> <span>₹{subtotal.toLocaleString()}</span></div>
                                            <div className="summary-item"><p>Shipping</p> <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span></div>
                                            <div className="summary-item"><p>Tax</p> <span>₹{tax.toLocaleString()}</span></div>
                                            <div className="summary-total">
                                                <p>Total</p> <span className="gradient-text">₹{total.toLocaleString()}</span>
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
                                                    <input type="text" className="form-input" placeholder="1234 5678 9012 3456"/>
                                                </div>
                                                <div className="form-grid-two-col">
                                                    <div>
                                                        <label className="form-label">Expiry Date</label>
                                                        <input type="text" className="form-input" placeholder="MM/YY"/>
                                                    </div>
                                                    <div>
                                                        <label className="form-label">CVV</label>
                                                        <input type="text" className="form-input" placeholder="123"/>
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
                                             <div className="summary-item"><p>Subtotal</p> <span>₹{subtotal.toLocaleString()}</span></div>
                                             <div className="summary-item"><p>Shipping</p> <span>{shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}</span></div>
                                             <div className="summary-item"><p>Tax</p> <span>₹{tax.toLocaleString()}</span></div>
                                             <div className="summary-total">
                                                 <p>Total</p> <span className="gradient-text">₹{total.toLocaleString()}</span>
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