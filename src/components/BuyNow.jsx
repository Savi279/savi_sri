import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '../styleSheets/buynowpage.css';
import { customerProductApi, customerOrderApi } from '../api/customer_api';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../store/cartSlice';
import { fetchUser } from '../store/userSlice';
import PaymentIntegration from './PaymentIntegration';

const BuyNow = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { productId: urlProductId } = useParams();
    const dispatch = useDispatch();

    const { currentUser, isAuthenticated } = useSelector(state => state.user);

    const [currentStep, setCurrentStep] = useState(1);
    const [cartItems, setCartItems] = useState(location.state?.cartItems || []);
    const [shippingCost, setShippingCost] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(cartItems.length === 0);
    const [error, setError] = useState(null);
    const [orderId, setOrderId] = useState(null);

    // Shipping Address State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [shippingAddress, setShippingAddress] = useState({
        houseFlatNo: '',
        building: '',
        area: '',
        city: '',
        pin: '',
        state: '',
        country: '',
    });
    const [address, setAddress] = useState('');

    // User data and address selection
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
    const [useNewAddress, setUseNewAddress] = useState(false);
    const [receiverPhone, setReceiverPhone] = useState('');
    const [useDifferentReceiver, setUseDifferentReceiver] = useState(false);
    const [receiverFirstName, setReceiverFirstName] = useState('');
    const [receiverLastName, setReceiverLastName] = useState('');
    const [newAddressLabel, setNewAddressLabel] = useState('Home');
    const [saveNewAddress, setSaveNewAddress] = useState(false);

    // Fetch user data if authenticated and not available
    useEffect(() => {
        if (isAuthenticated && !currentUser) {
            dispatch(fetchUser());
        }
    }, [isAuthenticated, currentUser, dispatch]);

    // Pre-fill form with user data
    useEffect(() => {
        if (currentUser) {
            const nameParts = currentUser.name ? currentUser.name.split(' ') : ['', ''];
            setFirstName(nameParts[0] || '');
            setLastName(nameParts.slice(1).join(' ') || '');

            // Set default address if available
            if (currentUser.addresses && currentUser.addresses.length > 0) {
                const defaultAddress = currentUser.addresses.find(addr => addr.isDefault) || currentUser.addresses[0];
            setShippingAddress({
                houseFlatNo: defaultAddress.house || '',
                building: '',
                area: defaultAddress.area || '',
                city: defaultAddress.city || '',
                pin: defaultAddress.postalCode || '',
                state: defaultAddress.state || '',
                country: defaultAddress.country || '',
            });
            const builtAddress = `${defaultAddress.house || ''}, ${defaultAddress.area || ''}, ${defaultAddress.city || ''}, ${defaultAddress.postalCode || ''}, ${defaultAddress.state || ''}, ${defaultAddress.country || ''}`.replace(/^, |, $/, '').replace(/, ,/g, ',').trim();
            setAddress(builtAddress);
                setSelectedAddressIndex(currentUser.addresses.findIndex(addr => addr.isDefault) || 0);
            }

            // Set receiver phone to user's phone by default
            setReceiverPhone(currentUser.mobile || '');
        }
    }, [currentUser]);

    // Fetch product details for each item if needed
    useEffect(() => {
        const fetchMissingProductDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const updatedItems = await Promise.all(cartItems.map(async (item) => {
                    if (!item.product.name || !item.product.sizes) {
                        const fetchedProduct = await customerProductApi.getById(item.product._id || item.product.id);
                        return {
                            ...item,
                            product: fetchedProduct,
                        };
                    }
                    return item;
                }));
                setCartItems(updatedItems);
            } catch (err) {
                console.error("Failed to fetch product details for BuyNow:", err);
                setError("Failed to load product details. Please try again.");
                setTimeout(() => navigate('/'), 2000);
            } finally {
                setLoading(false);
            }
        };

        if (cartItems.length > 0) {
            fetchMissingProductDetails();
        } else if (urlProductId) {
            const fetchSingleProduct = async () => {
                setLoading(true);
                setError(null);
                try {
                    const product = await customerProductApi.getById(urlProductId);
                    setCartItems([{
                        product,
                        selectedSize: product.sizes && product.sizes.length > 0 ? product.sizes[0] : '',
                        quantity: 1,
                    }]);
                } catch (err) {
                    console.error("Failed to fetch product details for BuyNow:", err);
                    setError("Failed to load product details. Please try again.");
                    setTimeout(() => navigate('/'), 2000);
                } finally {
                    setLoading(false);
                }
            };
            fetchSingleProduct();
        } else {
            setLoading(false);
        }
    }, [cartItems.length, location.state, navigate, urlProductId]);

    // Render loading or error state early
    if (loading) {
        return <div className="buy-now-loading">Loading product details...</div>;
    }

    if (error || cartItems.length === 0) {
        return <div className="buy-now-error">{error || "No products available."}</div>;
    }

    // Calculate subtotal, tax, total for all items
    const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.12);
    const total = subtotal + tax + shippingCost;

    const changeQuantity = (index, amount) => {
        setCartItems(prevItems => {
            const newItems = [...prevItems];
            const newQuantity = Math.max(1, Math.min(10, newItems[index].quantity + amount));
            newItems[index].quantity = newQuantity;
            return newItems;
        });
    };

    const changeSelectedSize = (index, size) => {
        setCartItems(prevItems => {
            const newItems = [...prevItems];
            newItems[index].selectedSize = size;
            return newItems;
        });
    };

    const deselectItem = (index) => {
        setCartItems(prevItems => {
            const newItems = [...prevItems];
            newItems.splice(index, 1);
            return newItems;
        });
    };

    const handleStepNavigation = (step) => {
        setCurrentStep(step);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const completeOrder = async (e) => {
        e.preventDefault();
        if (cartItems.length === 0) {
            setError("No items selected for order.");
            return;
        }
        const orderItems = cartItems.map(item => ({
            product: item.product._id || item.product.id,
            name: item.product.name,
            imageUrl: item.product.imageUrl || (item.product.images && item.product.images[0]) || '',
            quantity: item.quantity,
            price: item.product.price,
            size: item.selectedSize,
        }));

        // Use address string directly
        const orderDetails = {
            orderItems,
            shippingAddress: {
                address: address,
            },
            receiverPhone: receiverPhone,
            paymentMethod,
            taxPrice: tax,
            shippingPrice: shippingCost,
            totalPrice: total,
        };

        try {
            const response = await customerOrderApi.placeOrder(orderDetails);
            console.log("Order placed successfully:", response);
            setOrderId(response._id);

            if (paymentMethod === 'cod') {
                dispatch(clearCart());
                setShowModal(true);
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

    return (
        <div className="buy-now-container">
            <main className="container page-content">
                {renderStepIndicator()}

                {/* Step 1: Product Selection */}
                {currentStep === 1 && (
                    <div className="checkout-step active">
                        <div className="step-grid">
                            <div className="product-list-section">
                                {cartItems.length === 0 ? (
                                    <p>No items selected.</p>
                                ) : (
                                    cartItems.map((item, index) => (
                                        <div key={`${item.product._id}-${index}`} className="product-item">
                                            <div className="product-image-bg">
                                                <img
                                                    src={item.product.images && item.product.images.length > 0 ? `http://localhost:5000${item.product.images[0]}` : `http://localhost:5000${item.product.imageUrl}`}
                                                    alt={item.product.name}
                                                    className="product-image"
                                                />
                                            </div>
                                            <div className="product-details">
                                                <h3 className="product-name">{item.product.name}</h3>
                                                <p className="product-description">{item.product.description}</p>
                                                <div className="size-selector">
                                                    <h4>Select Size</h4>
                                                    {item.product.sizes && item.product.sizes.length > 0 ? (
                                                        item.product.sizes.map(sizeObj => {
                                                            const sizeValue = typeof sizeObj === 'object' ? sizeObj.size : sizeObj;
                                                            return (
                                                                <button
                                                                    key={sizeValue}
                                                                    className={`size-option ${item.selectedSize === sizeValue ? 'selected' : ''}`}
                                                                    onClick={() => changeSelectedSize(index, sizeValue)}
                                                                >
                                                                    {sizeValue}
                                                                </button>
                                                            );
                                                        })
                                                    ) : (
                                                        <p>No sizes available.</p>
                                                    )}
                                                </div>
                                                <div className="quantity-selector">
                                                    <h4>Quantity</h4>
                                                    <button onClick={() => changeQuantity(index, -1)}>-</button>
                                                    <span>{item.quantity}</span>
                                                    <button onClick={() => changeQuantity(index, 1)}>+</button>
                                                </div>
                                                <button className="deselect-btn" onClick={() => deselectItem(index)}>Remove Item</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                        <div className="nav-buttons center-button">
                            <button className="btn-unique nav-btn" onClick={() => handleStepNavigation(2)}>
                                <span>Continue to Shipping →</span>
                            </button>
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
                                            {/* User Details Section */}
                                            <div className="form-section">
                                                <h4 className="section-title">Contact Information</h4>
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
                                            </div>

                                            {/* Address Selection Section */}
                                            <div className="form-section">
                                                <h4 className="section-title">Delivery Address</h4>

                                                {/* Saved Addresses */}
                                                {isAuthenticated && currentUser?.addresses && currentUser.addresses.length > 0 && (
                                                    <div className="address-selection">
                                                        <h5>Select from saved addresses:</h5>
                                                        <div className="address-options">
                                                            {currentUser.addresses.map((addr, index) => (
                                                                <label key={index} className={`address-option glass-card ${selectedAddressIndex === index && !useNewAddress ? 'selected' : ''}`}>
                                                                    <input
                                                                        type="radio"
                                                                        name="savedAddress"
                                                                        checked={selectedAddressIndex === index && !useNewAddress}
                                                                        onChange={() => {
                                                                            setSelectedAddressIndex(index);
                                                                                setSelectedAddressIndex(index);
                                                                                setUseNewAddress(false);
                                                                                setAddress(addr.address || '');
                                                                            }}
                                                                        />
                                                                        <div className="address-details">
                                                                            <strong>{addr.label}</strong>
                                                                            <p>{addr.address}</p>
                                                                            {addr.isDefault && <span className="default-badge">Default</span>}
                                                                        </div>
                                                                    </label>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* New Address Option */}
                                                    <div className="new-address-toggle">
                                                        <label className="checkbox-label">
                                                            <input
                                                                type="checkbox"
                                                                checked={useNewAddress}
                                                                onChange={(e) => setUseNewAddress(e.target.checked)}
                                                            />
                                                            <span>Use a different address</span>
                                                        </label>
                                                    </div>

                                                    {/* Address Form */}
                                                    {(useNewAddress || !isAuthenticated || !currentUser?.addresses || currentUser.addresses.length === 0) && (
                                                        <div className="address-form">
                                                            {/* Structured Address Fields */}
                                                            <div className="form-grid-two-col">
                                                                <div>
                                                                    <label className="form-label">House/Flat No. *</label>
                                                                    <input
                                                                        type="text"
                                                                        required
                                                                        className="form-input"
                                                                        placeholder="Enter house/flat number"
                                                                        value={shippingAddress.houseFlatNo}
                                                                        onChange={(e) => setShippingAddress(prev => ({ ...prev, houseFlatNo: e.target.value }))}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="form-label">Building/Apartment *</label>
                                                                    <input
                                                                        type="text"
                                                                        required
                                                                        className="form-input"
                                                                        placeholder="Enter building name"
                                                                        value={shippingAddress.building}
                                                                        onChange={(e) => setShippingAddress(prev => ({ ...prev, building: e.target.value }))}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="form-label">Area/Street *</label>
                                                                <input
                                                                    type="text"
                                                                    required
                                                                    className="form-input"
                                                                    placeholder="Enter area or street name"
                                                                    value={shippingAddress.area}
                                                                    onChange={(e) => setShippingAddress(prev => ({ ...prev, area: e.target.value }))}
                                                                />
                                                            </div>
                                                            <div className="form-grid-two-col">
                                                                <div>
                                                                    <label className="form-label">City *</label>
                                                                    <input
                                                                        type="text"
                                                                        required
                                                                        className="form-input"
                                                                        placeholder="Enter city"
                                                                        value={shippingAddress.city}
                                                                        onChange={(e) => setShippingAddress(prev => ({ ...prev, city: e.target.value }))}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="form-label">PIN Code *</label>
                                                                    <input
                                                                        type="text"
                                                                        required
                                                                        className="form-input"
                                                                        placeholder="Enter PIN code"
                                                                        value={shippingAddress.pin}
                                                                        onChange={(e) => setShippingAddress(prev => ({ ...prev, pin: e.target.value }))}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div className="form-grid-two-col">
                                                                <div>
                                                                    <label className="form-label">State *</label>
                                                                    <input
                                                                        type="text"
                                                                        required
                                                                        className="form-input"
                                                                        placeholder="Enter state"
                                                                        value={shippingAddress.state}
                                                                        onChange={(e) => setShippingAddress(prev => ({ ...prev, state: e.target.value }))}
                                                                    />
                                                                </div>
                                                                <div>
                                                                    <label className="form-label">Country *</label>
                                                                    <input
                                                                        type="text"
                                                                        required
                                                                        className="form-input"
                                                                        placeholder="Enter country"
                                                                        value={shippingAddress.country}
                                                                        onChange={(e) => setShippingAddress(prev => ({ ...prev, country: e.target.value }))}
                                                                    />
                                                                </div>
                                                            </div>
                                                            {useNewAddress && (
                                                                <div className="form-grid-two-col">
                                                                    <div>
                                                                        <label className="form-label">Address Label</label>
                                                                        <select className="form-input" value={newAddressLabel} onChange={(e) => setNewAddressLabel(e.target.value)}>
                                                                            <option value="Home">Home</option>
                                                                            <option value="Work">Work</option>
                                                                            <option value="Other">Other</option>
                                                                        </select>
                                                                    </div>
                                                                    <div className="checkbox-container">
                                                                        <label className="checkbox-label">
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={saveNewAddress}
                                                                                onChange={(e) => setSaveNewAddress(e.target.checked)}
                                                                            />
                                                                            <span>Save this address</span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Receiver Phone Section */}
                                                <div className="form-section">
                                                    <h4 className="section-title">Receiver Details</h4>
                                                    <div className="receiver-phone-section">
                                                        <label className="checkbox-label">
                                                            <input
                                                                type="checkbox"
                                                                checked={useDifferentReceiver}
                                                                onChange={(e) => setUseDifferentReceiver(e.target.checked)}
                                                            />
                                                            <span>Receiver is different from buyer</span>
                                                        </label>
                                                        <div>
                                                            <label className="form-label">Receiver Phone Number *</label>
                                                            <input
                                                                type="tel"
                                                                required
                                                                className="form-input"
                                                                placeholder="Enter receiver's phone number"
                                                                value={receiverPhone}
                                                                onChange={(e) => setReceiverPhone(e.target.value)}
                                                                disabled={!useDifferentReceiver && isAuthenticated}
                                                            />
                                                            {!useDifferentReceiver && isAuthenticated && (
                                                                <small className="form-hint">Using your registered phone number</small>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                            {/* Delivery Options */}
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
                        userEmail: 'user@example.com',
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
