import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserOrders } from '../store/orderSlice';
import { Link } from 'react-router-dom';
import '../styleSheets/OrderHistory.css'; // You'll need to create this CSS file

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (loading) {
    return <div className="order-history-loading">Loading orders...</div>;
  }

  if (error) {
    return <div className="order-history-error">Error: {error}</div>;
  }

  return (
    <div className="order-history-container">
      <h1 className="order-history-title">My Orders</h1>
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <Link to="/collections" className="start-shopping-btn">Start Shopping</Link>
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <h3>Order ID: {order._id}</h3>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="order-details-summary">
                {order.products.map((item) => (
                  <div key={item.product} className="order-item-summary">
                    <img src={`http://localhost:5000${item.imageUrl}`} alt={item.name} className="order-item-image" />
                    <div className="order-item-info">
                      <p className="order-item-name">{item.name}</p>
                      <p className="order-item-qty">Qty: {item.quantity}</p>
                      <p className="order-item-price">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <p>Total: ₹{order.totalPrice.toFixed(2)}</p>
                <p className={`order-status ${order.isDelivered ? 'delivered' : order.isPaid ? 'paid' : 'pending'}`}>
                  Status: {order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Pending'}
                </p>
                <Link to={`/order/${order._id}`} className="view-details-btn">View Details</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
