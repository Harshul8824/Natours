const express = require('express');
const authController = require('./../Controller/authController');
const bookingController = require('./../Controller/bookingController');
const razorpayController = require('./../Controller/razorpayController');

const router = express.Router();

// Public webhook route (Doesn't need authentication since it is triggered by Razorpay)
router.post('/webhook', razorpayController.razorpayWebhook);

// Protect all routes below
router.use(authController.protect);

// Endpoint used by frontend to create an order
router.get('/razorpay-order/:tourID', bookingController.getCheckOutSession);

// Admin / Lead-guide only routes
router.use(authController.restrictTo('admin', 'lead-guide'));

router.route('/')
    .get(bookingController.getAllBookings)
    .post(bookingController.createBooking);

router.route('/:id')
    .get(bookingController.getBooking)
    .patch(bookingController.updateBooking)
    .delete(bookingController.deleteBooking);

module.exports = router;
