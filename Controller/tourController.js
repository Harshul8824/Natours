const { json } = require('express');
const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/APIFeatures');
const { startSession } = require('mongoose');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('../utils/appError');

//2. Route Handlers
exports.home = (req,res) =>{ 
     res.status(200).json({message : "hello from the server side!", app : 'Natours'});
}

//tours route handler
 exports.createTour = catchAsync(async (req,res,next)=>{
         
   const newTour = await Tour.create(req.body);

   res.status(201).json({
        status : 'success',
        data : {
            tour : newTour
        }
      });
});


 //middleware for aliasing
 exports.aliasTopTours = (req, res, next)=>{
   req.query.limit = '5';
   req.query.sort = '-ratingsAverage,price';
   req.query.fields = 'name,price,difficulty,summary';

   next();
 }

 exports.getToursStats = catchAsync(async (req,res,next)=>{
     const stats = await Tour.aggregate([
      {
         $match : {ratingAverage : {$gte : 4.5}}
      },
      {
         $group : {
            _id : {$toUpper : '$difficulty'},
            numTours : {$sum : 1},
            avgRating : {$avg : '$ratingAverage'},
            avgPrice : {$avg : '$price'},
            minPrice : {$min : '$price'},
            maxPrice : {$max : '$price'}
         }
      },
      {
         $sort : {avgPrice : 1}
      },
      // {
      //    $match : {_id : {$ne : 'EASY'}}
      // }
     ])

   //send response
     res.status(200).json({
     status : 'success',
     data: {   
        stats
     }
   })
 })

 exports.getMonthlyTours = catchAsync(async(req,res,next) =>{
    const year = req.params.year*1;
    console.log(year);

    const plan = await Tour.aggregate([
       {
         $unwind : '$startDates'   //to break the startdates arr into single-single documnent
      },
      {
         $match : {
            startDates : {
               $gte : new Date(`${year}-01-01`),
               $lte : new Date(`${year}-12-31`)
            }
         }
      },
      {
         $group : {
            _id : {$month : '$startDates'},
            numTours : {$sum : 1},
            tours : {$push : '$name'}
         }
      },
      {
         $addFields : {month : '$_id'}
      },
      {
        $project : {_id : 0}
      },
      {
         $sort : {numTours : -1}
      },
      // {
      //    $limit : 3
      // }

    ])

    console.log(plan);

   //send response
     res.status(200).json({
     status : 'success',
     data: {   
        plan
     }
   })
 })

 exports.getAllTours = catchAsync(async (req,res,next)=>{
  const features = new APIFeatures(Tour.find(), req.query)
  .filter()
  .Sort()
  .Paging()
  .limitFields();
  //Execute query 
  const tours = await features.query;

//   const tours = await Tour.find().where("difficulty").equals('easy').where("duration").equals(5);

//send response
     res.status(200).json({
     status : 'success',
     results: tours.length,
     data: {   
        tours
     }
   })
})



 exports.getTour = catchAsync(async (req,res,next)=>{
      // const tour = await Tour.findOne({_id : req.params.id}) //bad practice
      const tour = await Tour.findById(req.params.id) //good practice

      if(!tour){
        return next(new AppError('No tour find with that id', 404));
      }

     res.status(200).json({
     status : 'success',
     data: {
        tour
     }
   })
})

exports.updateTour = catchAsync(async (req,res,next)=>{

   //   const tour = await Tour.updateOne({_id : req.params.id}, {$set : req.body}); 
const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
   new : true,   //	Returns the updated document (not the original)
   runValidators : true  //Ensures Mongoose runs schema validators on the update operation
}); 

       if(!tour){
        return next(new AppError('No tour find with that id', 404));
      }

   res.status(200).json({
      status : "success",
      data : {
         tour
      }
   })
})

exports.deleteTour = catchAsync(async (req,res,next)=>{
     const tour = await Tour.findByIdAndDelete(req.params.id);
     
      if(!tour){
        return next(new AppError('No tour find with that id', 404));
      }

      res.status(204).json({ //204 -> no content
      statue : "success",
      data : null
   });
})