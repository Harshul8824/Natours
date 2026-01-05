const express = require('express');
const userController = require('./../Controller/userController');
const router = express.Router();
const authController = require('./../Controller/authController');


//USER ROUTES

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgetPassword', authController.forgetPassword);
router.patch('/resetPassword/:token', authController.resetPassword);



//PROTECT ALL ROUTES AFTER THIS MIDDLEWARE
router.use(authController.protect);

router.patch('/updatePassword', authController.updatePassword);

router.patch('/updateMe', userController.uploadUserPhoto, userController.resizeUserPhoto, userController.updateMe);

router.delete('/deleteMe', userController.deleteMe);

router.get('/me', userController.getMe, userController.getUser);

router.use(authController.restrictTo('admin'));


router.route('/')
    .get(userController.getAllUsers)
    .post(userController.addUser);

router.route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(authController.restrictTo('admin', 'lead-guide'), userController.deleteUser);



module.exports = router;