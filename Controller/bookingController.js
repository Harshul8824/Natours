const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/AppError');
const Tour = require('./../models/tourModel');
const Razorpay = require('razorpay');
const factory = require('./handlerFactory');
const Booking = require('./../models/bookingModel');

exports.getCheckOutSession = catchAsync(async (req, res, next) => {
   if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      return next(new AppError('Payment keys are not configured on the server environment!', 500));
   }

   const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
   });

   //1) GET THE CURRENTLY BOOKED TOUR
   const tour = await Tour.findById(req.params.tourID);
   if (!tour) return next(new AppError('Tour not found!', 404));

   // 2) Create Razorpay order
   const order = await razorpay.orders.create({
      amount: tour.price * 100, // INR in paise
      currency: 'INR',
      receipt: `tour_${tour.id}`,
      notes: {
         tourId: tour.id,
         userId: req.user.id
      }
   });

   // 3) Send order to frontend
   res.status(200).json({
      status: 'success',
      order,
      key_id: process.env.RAZORPAY_KEY_ID
   });
});

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
