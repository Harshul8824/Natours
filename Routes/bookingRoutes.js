const express = require('express')
const authController = require('./../Controller/authController');
const bookingController = require('./../Controller/bookingController');

const router = express.Router(); 

router.get('/razorpay-order/:tourId', authController.protect, bookingController.getCheckOutSession);

module.exports = router;

