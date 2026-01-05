const { json } = require('express');
const catchAsync = require('../utils/catchAsync');
const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');


// exports.getAllReview = catchAsync(async (req, res, next) =>{

//    let filter = {};
//    if(req.params.tourId) filter = {tour : req.params.tourId};

//    const reviews = await Review.find(filter);

//    res.status(200).json({
//     status : "success",
//     results : reviews.length,
//     data : {
//         reviews
//     }
//    })
// })

exports.setTourUserId = (req, res, next) =>{
     if(!req.body.tour) req.body.tour = req.params.tourId;
    if(!req.body.user) req.body.user = req.user.id;

    next();
}

exports.getAllReview = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.AddReview = factory.createOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.UpdateReview = factory.updateOne(Review);