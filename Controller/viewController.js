const Tour = require('./../models/tourModel');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const appError = require('./../utils/AppError');
const AppError = require('./../utils/AppError');

exports.getOverview = catchAsync(async (req, res) => {
  //1) get tour data from collection
  const tours = await Tour.find();

  //2) Build template
  //3) Render that template using tour data from 1
  res.status(200).render('overview', {
    title: 'All Tours',
    tours
  })
})

exports.getTour = catchAsync(async (req, res, next) => {
  //1) get the data from the requested tour (includes review and guides)
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'reviews rating user'
  });

  if (!tour) {
    return next(new AppError("There is no tour with that name", 404));
  }
  //2) build template
  //3) render template using data from 1


  res.status(200).render('tour', {
    title: `${tour.name} tour`,
    tour
  })
})


exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: "log in to your account"
  })
})

exports.getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your Account'
  });
}

exports.updateUserData = catchAsync(async (req, res, next) => {
  // console.log('UPDATING USER', req.body);
  const updatedUser = await User.findByIdAndUpdate(req.user.id, {
    name: req.body.name,
    email: req.body.email
  },
    {
      new: true,
      runValidators: true
    });

  res.status(200).render('account', {
    title: 'Your Account',
    user: updatedUser
  });
})