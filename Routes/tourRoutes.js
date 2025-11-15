const express = require('express');
const tourController = require('./../Controller/tourController');

const router = express.Router();

router.param('id', tourController.checkId)



router.route('/')
.get(tourController.getAllTours)
.post(tourController.checkBody, tourController.addTour);

router.route('/:id')
.get(tourController.getTour)
.patch(tourController.updateTour)
.delete(tourController.deleteTour)

module.exports = router;

