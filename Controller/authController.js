const { default: mongoose } = require('mongoose');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const {promisify} = require('util');
const sendEmail = require('./../utils/email');
const crypto = require('crypto'); 

const createSendTOken = (user, statusCode, res) =>{
    const token = signToken(user._id)

    const cookieOptions = {
        expires : new Date(
             Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
        ),
        httpOnly : true
    }

    res.cookie('jwt', token, cookieOptions)

   if(process.env.NODE_ENV === 'production'){
     cookieOptions.secure = true;
   }

    res.status(statusCode).json({
        status : "success",
        token,
        data : {
            user
        }
    })
}


const signToken = id =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
       expiresIn : process.env.JWT_EXPIRES_IN
    })
}

exports.signup = catchAsync(async(req,res,next)=>{
    const newUser = await User.create(req.body);
    
  createSendTOken(newUser, 201, res);
});


exports.login = catchAsync(async(req,res,next)=>{
    const {email, password} = req.body;

    //1) check if email and pass is exist
    if(!email || !password){
        return next(new AppError('please provide email and password', 400));
    }

    //2) check if user exist and password is correct
    const user = await User.findOne({email}).select('+password');
    // console.log(user);
    
    if(!user || !(await user.correctPassword(password, user.password))){
        return next(new AppError("enter the right email or password",401));
    }

    //3) if everything ok send token to client
createSendTOken(user, 201, res)
});

exports.protect = catchAsync(async(req,res,next)=>{
    //1) getting token and check of it there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    console.log(token);
    if(!token){
        return next(new AppError('you are not logged in ! please log in to get access', 401))
    }

    //2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);  //promisify (from Node’s util module) converts the callback-based jwt.verify into a Promise-returning function.
    //Now await can be used instead of callbacks.
    // console.log(decoded); //decoded = the payload you signed, plus iat (issued at) and exp (expiry).

    //3) Check if user still exist
    const currUser = await User.findById(decoded.id);

    if(!currUser){
        return next(new AppError('the user belonging to this token does no longer exists', 401))
    }

    //4) check if user changed password after the token was issued
     if(currUser.changePasswordAfter(decoded.iat)){  //this func is intialize at userModel.js
        return next(new AppError('user recently changed password ! Please log in again', 401))
     }
   
    //grant access
    req.user = currUser;
    next();
})

exports.restrictTo = (...roles)=>{
     return (req,res,next)=>{ //roles ['admin', "lead-guide"] role = 'user' then enter in this if condn
        console.log(req.user.role);
        if(!(roles.includes(req.user.role))){
            return next(new AppError("you have not permission to delete this"))
        }

        next();
     }
}
// 🔹 Controller for initiating password reset
exports.forgotPassword = async (req,res,next) => {
   //1) get user based on postal email
   const user = await User.findOne({email : req.body.email});
   if(!user){
    return next(new AppError('There is no user with email address', 404));
   }

   //2) generate the random reset token (this also sets resetToken + expiry on the user)
   const resetToken = user.createPasswordResetToken();

   // Save user with resetToken + expiry, skipping validation checks
   await user.save({validateBeforeSave : false});

   //3) send it to user email
   const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

   const message = `Forgot your password? submit a patch request with your new password and password confirm to : ${resetUrl}.\n If you didn't forget your password, please ignore this email!`;

try{
   await sendEmail({
    email : user.email,
    subject : 'Your password',
    message
   });
   res.status(200).json({
    status : 'success',
    message : 'token sent to email!'
   });
} catch(err){
 user.passwordResetToken = undefined;
 user.passwordResetExpires = undefined;
 await user.save({validateBeforeSave : false});

 return next(new AppError('there was an error sending the email. try again later', 500)) 
}

}
exports.resetPassword = catchAsync(async (req,res,next) => {
    //1) get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({passwordResetToken : hashedToken, passwordResetExpires : {$gt : Date.now()}});

    //2) if token has not expired, and there is user sent the new password
   if(!user){
        return next(new AppError('token is invalid or has expired', 400));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    //3) update changepasswordAt property for the user -> create a middleware in the userRoutes.js

    //4) log the user ad sent JWT
createSendTOken(user, 201, res);
})

exports.updatePassword = catchAsync(async(req,res,next) =>{
    //1) get user from collection
    console.log(req.user);
    let user = await User.findById(req.user.id).select('+password');

    //2) check if posted current password is correct
    if(!(await user.correctPassword(req.body.passwordCurrent, user.password))){
       return next(new AppError('your curr pass is wrong',401));
    }
    //3) if so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    //4) log user in , send jwt
createSendTOken(user, 201, res)
})