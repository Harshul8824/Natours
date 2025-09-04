const express = require('express');
const tourController = require('./../Controller/tourController');
const authController = require('./../Controller/authController')

const router = express.Router();

//param middleware
// router.param('id', tourController.CheckId)

router.route('/cheap-tours').get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getToursStats);

router.route('/monthly-plan/:year').get(tourController.getMonthlyTours);

router
.route('/')
.get(authController.protect, tourController.getAllTours)
.post(tourController.createTour);

router
.route('/:id')
.get(tourController.getTour)
.patch(tourController.updateTour)
.delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour);

module.exports = router