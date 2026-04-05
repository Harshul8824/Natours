const viewController = require('./../Controller/viewController');
const express = require('express');
const authController = require('./../Controller/authController');
const router = express.Router();


//ROUTE FOR PUG FILE
router.get('/', authController.isLoggedIn, viewController.getOverview)
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour)
//login route   
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewController.getSignupForm);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-tours', authController.protect, viewController.getMyTours);

router.get('/forgot-password', viewController.getForgotPasswordForm);
router.get('/reset-password/:token', viewController.getResetPasswordForm);

router.post('/submit-user-data',  authController.protect, viewController.updateUserData);

// Admin Routes
router.get('/manage-tours', authController.protect, authController.restrictTo('admin'), viewController.getManageTours);
router.get('/manage-users', authController.protect, authController.restrictTo('admin'), viewController.getManageUsers);
router.get('/manage-reviews', authController.protect, authController.restrictTo('admin'), viewController.getManageReviews);
router.get('/manage-bookings', authController.protect, authController.restrictTo('admin'), viewController.getManageBookings);

// User Reviews
router.get('/my-reviews', authController.protect, viewController.getMyReviews);

module.exports = router;