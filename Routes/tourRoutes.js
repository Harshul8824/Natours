const express = require('express');
const tourController = require('./../Controller/tourController');
const authController = require('./../Controller/authController');
const reviewController = require('./../Controller/reviewController');
const reviewRoutes = require('./reviewRoutes');

const router = express.Router();

// router.param('id', tourController.checkId)


router.route('/top-5-cheap').get(tourController.aliasTopTours,tourController.getAllTours)
router.route('/tour-stats').get(tourController.getTourStats);
router.route(`/monthly-plan/:year`).get(authController.protect, authController.restrictTo('admin', 'lead-guide', 'guide'), tourController.getMonthlyPlan);

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within/233/center/34.016214,-118.270861/unit/mi
router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin);

router.route('/distance/:latlng/unit/:unit').get(tourController.getDistances);

router.route('/')    
.get(tourController.getAllTours)
.post(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.addTour);

router.route('/:id')
.get(tourController.getTour)
.patch(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.uploadTourPhoto, tourController.resizeTourPhoto, tourController.updateTour)
.delete(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.deleteTour)

// POST /tour/tourId/reviews
// GET /tour/tourId/reviews
// GET /tour/tourId/reviews/reviewId

// router.route('/:tourId/reviews')
// .post(authController.protect, authController.restrictTo('user'), reviewController.AddReview); //here bad practice(becoz repitartion is done) so instaead of this use router.use()

router.use('/:tourId/reviews', reviewRoutes);

module.exports = router;

