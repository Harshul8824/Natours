const reviewController = require('./../Controller/reviewController');
const express = require('express')
const authController = require('./../Controller/authController');

const router = express.Router({mergeParams : true});  //merge params is used to take take the parent route (tourID from the tourRoutes.js router.use('/:tourId/reviews', reviewRoutes); )

// POST /tour/tourId/reviews
// GET /tour/tourId/reviews     router.route('/') => this run for both by using this "const router = express.Router({mergeParams : true});"

router.use(authController.protect);

router.route('/')
.get(reviewController.getAllReview)
.post(authController.restrictTo('user'), reviewController.setTourUserId,  reviewController.AddReview)


router.route("/:id")
.get(reviewController.getReview)
.patch(authController.restrictTo('admin', 'user'), reviewController.UpdateReview)
.delete(authController.restrictTo('admin', 'user'), reviewController.deleteReview);

module.exports = router;

