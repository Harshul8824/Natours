const catchAsync = require("../utils/catchAsync");
const User = require('./../models/userModel')
const { startSession } = require('mongoose');
const { json } = require('express');
const AppError = require("../utils/appError");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
   Object.keys(obj).forEach((el) =>{
       if(allowedFields.includes(el)) newObj[el] = obj[el];
   })
   return newObj;
}

//user route handler
 exports.getAllUsers = catchAsync(async (req,res,next)=>{
   const users = await User.find().select('-__v');
 
 //send response
      res.status(200).json({
      status : 'success',
      results: users.length,
      data: {
         users
      }
    })
 })

 exports.updateMe = async(req,res,next) =>{
  //1) create error if user post password data
  if(req.body.password || req.body.passwordConfirm){
    return next(new AppError("this route is not for password update ! please use /updatePassword",400));
  }
 
  //2) filter out unwanted fields names that are not allowed to be updated
  const filterBody = filterObj(req.body, 'name', 'email'); //only this two field are updated

   //3) update user document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new : true, //create new obj
    runValidator : true
  })


  res.status(200).json({
    status : "success",
    data : updateUser
  })
}

exports.deleteMe = async(req,res,next)=>{
  await User.findByIdAndUpdate(req.user.id, {active : false});

  res.status(200).json({    
    status : "success",
    data : null
  })
}

 exports.createUser = (req,res)=>{
   res.status(500).json({   //500 -> server error
     status : 'failed',
     message : "this route is not yet defined"
   });
}

 exports.getUser = (req,res)=>{
   res.status(500).json({   //500 -> server error
     status : 'failed',
     message : "this route is not yet defined"
   });
}

 exports.updateUser = (req,res)=>{
   res.status(500).json({   //500 -> server error
     status : 'failed',
     message : "this route is not yet defined"
   });
}

 exports.deleteUser = (req,res)=>{
   res.status(500).json({   //500 -> server error
     status : 'failed',
     message : "this route is not yet defined"
   });
}

