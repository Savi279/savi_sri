import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { customerOrderApi } from '../api/customer_api';
import '../styleSheets/OrderDetails.css'; // You'll need to create this CSS file

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const orderData = await customerOrderApi.getOrderById(id);
        setOrder(orderData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return <div className="order-details-loading">Loading order details...</div>;
  }

  if (error) {
    return <div className="order-details-error">Error: {error}</div>;
  }

  if (!order) {
    return <div className="order-details-not-found">Order not found.</div>;
  }

  return (
    <div className="order-details-container">
      <h1 className="order-details-title">Order Details</h1>
      <div className="order-details-card">
        <div className="order-details-header">
          <h2>Order ID: {order._id}</h2>
          <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="shipping-info">
          <h3>Shipping Information</h3>
          <p><strong>Name:</strong> {order.user.name}</p>
          <p><strong>Email:</strong> {order.user.email}</p>
          <p><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}, {order.shippingAddress.country}</p>
        </div>

        <div className="payment-info">
          <h3>Payment Information</h3>
          <p><strong>Method:</strong> {order.paymentMethod}</p>
          <p><strong>Status:</strong> <span className={order.isPaid ? 'paid' : 'pending'}>{order.isPaid ? 'Paid' : 'Pending'}</span></p>
          {order.paidAt && <p><strong>Paid At:</strong> {new Date(order.paidAt).toLocaleDateString()}</p>}
          {order.paymentResult && (
            <div className="payment-result">
              <p><strong>Payment ID:</strong> {order.paymentResult.id}</p>
              <p><strong>Payment Status:</strong> {order.paymentResult.status}</p>
            </div>
          )}
        </div>

        <div className="order-items-details">
          <h3>Order Items</h3>
          {order.products.map((item) => (
            <div key={item.product} className="order-item-detail-card">
              <img src={`http://localhost:5000${item.imageUrl}`} alt={item.name} className="order-item-detail-image" />
              <div className="order-item-detail-info">
                <p className="order-item-detail-name">{item.name}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ₹{item.price.toFixed(2)}</p>
                <p>Total: ₹{(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="order-summary-details">
          <h3>Order Summary</h3>
          <p>Subtotal: ₹{order.totalPrice - order.shippingPrice - order.taxPrice}</p>
          <p>Shipping: ₹{order.shippingPrice.toFixed(2)}</p>
          <p>Tax: ₹{order.taxPrice.toFixed(2)}</p>
          <p className="total-price">Total: ₹{order.totalPrice.toFixed(2)}</p>
        </div>

        <div className="delivery-status">
          <h3>Delivery Status</h3>
          <p>Status: <span className={order.isDelivered ? 'delivered' : 'pending'}>{order.isDelivered ? 'Delivered' : 'Pending'}</span></p>
          {order.deliveredAt && <p>Delivered At: {new Date(order.deliveredAt).toLocaleDateString()}</p>}
        </div>

        <div className="back-to-orders">
          <Link to="/profile" className="back-btn">← Back to Profile</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
