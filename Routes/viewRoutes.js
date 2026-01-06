const viewController = require('./../Controller/viewController');
const express = require('express');
const authController = require('./../Controller/authController');
const router = express.Router();


//ROUTE FOR PUG FILE
router.get('/', authController.isLoggedIn, viewController.getOverview)
router.get('/tour/:slug', authController.isLoggedIn, viewController.getTour)
//login route   
router.get('/login', authController.isLoggedIn, viewController.getLoginForm);
router.get('/me', authController.protect, viewController.getAccount);
router.get('/my-tours', authController.protect, viewController.getMyTours);

router.post('/submit-user-data',  authController.protect, viewController.updateUserData);


module.exports = router;