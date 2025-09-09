import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders } from '../store/orderSlice';
import { Link } from 'react-router-dom';
import { FaTruck, FaCheckCircle, FaTimesCircle, FaClock, FaUndo, FaBan } from 'react-icons/fa';
import '../styleSheets/OrderHistory.css';

const OrderHistoryEnhanced = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const [filter, setFilter] = useState('all');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returnReason, setReturnReason] = useState('');

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const getOrderStatusIcon = (order) => {
    if (order.isDelivered) {
      return <FaCheckCircle className="status-icon delivered" />;
    } else if (order.isPaid) {
      return <FaTruck className="status-icon shipped" />;
    } else {
      return <FaClock className="status-icon pending" />;
    }
  };

  const getOrderStatusText = (order) => {
    if (order.isDelivered) {
      return 'Delivered';
    } else if (order.isPaid) {
      return 'Shipped';
    } else {
      return 'Processing';
    }
  };

  const getTrackingSteps = (order) => {
    const steps = [
      { label: 'Order Placed', completed: true, date: order.createdAt },
      { label: 'Payment Confirmed', completed: order.isPaid, date: order.paidAt },
      { label: 'Shipped', completed: order.isPaid && !order.isDelivered },
      { label: 'Delivered', completed: order.isDelivered, date: order.deliveredAt }
    ];
    return steps;
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'delivered') return order.isDelivered;
    if (filter === 'pending') return !order.isDelivered;
    if (filter === 'paid') return order.isPaid && !order.isDelivered;
    return true;
  });

  const handleReturnRequest = (order) => {
    setSelectedOrder(order);
    setShowReturnModal(true);
  };

  const submitReturnRequest = async () => {
    // This would typically call an API to submit return request
    alert(`Return request submitted for Order ${selectedOrder._id} with reason: ${returnReason}`);
    setShowReturnModal(false);
    setSelectedOrder(null);
    setReturnReason('');
  };

  const handleCancelOrder = (orderId) => {
    // This would typically call an API to cancel the order
    if (window.confirm('Are you sure you want to cancel this order?')) {
      alert(`Order ${orderId} cancellation request submitted.`);
    }
  };

  if (loading) {
    return <div className="order-history-loading">Loading orders...</div>;
  }

  if (error) {
    return <div className="order-history-error">Error: {error}</div>;
  }

  return (
    <div className="order-history-container">
      <div className="order-history-header">
        <h1 className="order-history-title">My Orders</h1>
        <div className="order-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Orders
          </button>
          <button
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-btn ${filter === 'paid' ? 'active' : ''}`}
            onClick={() => setFilter('paid')}
          >
            Shipped
          </button>
          <button
            className={`filter-btn ${filter === 'delivered' ? 'active' : ''}`}
            onClick={() => setFilter('delivered')}
          >
            Delivered
          </button>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="no-orders">
          <p>No orders found for the selected filter.</p>
          <Link to="/collections" className="start-shopping-btn">Start Shopping</Link>
        </div>
      ) : (
        <div className="order-list">
          {filteredOrders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order._id.slice(-8)}</h3>
                  <p>Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="order-status-display">
                  {getOrderStatusIcon(order)}
                  <span className="status-text">{getOrderStatusText(order)}</span>
                </div>
              </div>

              <div className="order-tracking">
                <div className="tracking-steps">
                  {getTrackingSteps(order).map((step, index) => (
                    <div key={index} className={`tracking-step ${step.completed ? 'completed' : ''}`}>
                      <div className="step-circle">
                        {step.completed ? <FaCheckCircle /> : <FaClock />}
                      </div>
                      <div className="step-info">
                        <p className="step-label">{step.label}</p>
                        {step.date && <p className="step-date">{new Date(step.date).toLocaleDateString()}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="order-details-summary">
                {order.products.map((item) => (
                  <div key={item.product} className="order-item-summary">
                    <img
                      src={`http://localhost:5000${item.imageUrl}`}
                      alt={item.name}
                      className="order-item-image"
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/cccccc/000000?text=No+Image"; }}
                    />
                    <div className="order-item-info">
                      <p className="order-item-name">{item.name}</p>
                      <p className="order-item-qty">Qty: {item.quantity}</p>
                      <p className="order-item-price">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="order-total">
                  <p>Total: ₹{order.totalPrice.toFixed(2)}</p>
                </div>
                <div className="order-actions">
                  <Link to={`/order/${order._id}`} className="view-details-btn">View Details</Link>
                  {order.isDelivered && (
                    <button
                      className="return-btn"
                      onClick={() => handleReturnRequest(order)}
                    >
                      <FaUndo /> Return
                    </button>
                  )}
                  {!order.isPaid && !order.isDelivered && (
                    <button
                      className="cancel-btn"
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      <FaBan /> Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Return Request Modal */}
      {showReturnModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowReturnModal(false)}>
          <div className="return-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Return Order #{selectedOrder._id.slice(-8)}</h3>
              <button className="close-btn" onClick={() => setShowReturnModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>Please select a reason for return:</p>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                className="return-reason-select"
              >
                <option value="">Select reason</option>
                <option value="wrong-size">Wrong Size</option>
                <option value="damaged">Product Damaged</option>
                <option value="not-as-described">Not as Described</option>
                <option value="changed-mind">Changed Mind</option>
                <option value="other">Other</option>
              </select>
              <div className="modal-actions">
                <button className="cancel-return-btn" onClick={() => setShowReturnModal(false)}>
                  Cancel
                </button>
                <button
                  className="submit-return-btn"
                  onClick={submitReturnRequest}
                  disabled={!returnReason}
                >
                  Submit Return Request
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistoryEnhanced;
