/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// Load Razorpay script dynamically (safe way)
const loadRazorpay = () => {
    return new Promise(resolve => {
        if (window.Razorpay) return resolve(true);

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export const bookTour = async tourId => {
    try {
        // 1) Load Razorpay SDK
        const loaded = await loadRazorpay();
        if (!loaded) {
            return showAlert('error', 'Razorpay SDK failed to load');
        }

        // 2) Get Razorpay order from backend
        const res = await axios(
            `/api/v1/bookings/razorpay-order/${tourId}`
        );

        const { order, key_id } = res.data;

        // 3) Configure Razorpay checkout
        const options = {
            key: key_id,
            amount: order.amount,
            currency: order.currency,
            name: 'Natours',
            description: 'Tour Booking',
            order_id: order.id,

            handler: function () {
                showAlert('success', 'Payment successful! Booking will be confirmed shortly.');
            },

            theme: {
                color: '#55c57a'
            }
        };

        // 4) Open Razorpay Checkout
        const rzp = new window.Razorpay(options);
        rzp.open();

    } catch (err) {
        console.error(err);
        showAlert('error', 'Payment failed. Please try again.');
    }
};
