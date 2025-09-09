import { useEffect } from 'react';
import { loadScript } from '../utils/loadScript'; // Utility to load external scripts dynamically
import { customerOrderApi } from '../api/customer_api';

const PaymentIntegration = ({ orderDetails, onSuccess, onError }) => {
  useEffect(() => {
    const loadRazorpayScript = async () => {
      const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
      if (!res) {
        onError('Failed to load Razorpay SDK');
        return;
      }
      createOrder();
    };

    const createOrder = async () => {
      try {
        const order = await customerOrderApi.createRazorpayOrder({
          amount: orderDetails.totalPrice,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
        });

        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: 'Savi Sri',
          description: 'Purchase',
          order_id: order.id,
          handler: async function (response) {
            try {
              await customerOrderApi.verifyPayment({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderDetails._id,
              });
              onSuccess();
            } catch (err) {
              onError('Payment verification failed');
            }
          },
          prefill: {
            email: orderDetails.userEmail,
          },
          theme: {
            color: '#b38b2e',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } catch (err) {
        onError('Failed to create order');
      }
    };

    loadRazorpayScript();
  }, [orderDetails, onSuccess, onError]);

  return null; // This component does not render anything itself
};

export default PaymentIntegration;
