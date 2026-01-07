const { promisify } = require('util')
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('./../utils/AppError');
const bcrypt = require('bcryptjs');
const Email = require('./../utils/email');
const crypto = require('crypto');


const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);

    const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true  //using this : document.cookie CANNOT read this cookie, JavaScript CANNOT steal this cookie, Cookie is sent only via HTTP/HTTPS requests
    }
    if (process.env.NODE_ENV === 'production') cookieOption.secure = true;
    res.cookie('jwt', token, cookieOption);

    user.password = undefined;
    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user
        }
    });
}

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt,
        role: req.body.role
    });
    
    const url = `${req.protocol}://${req.get('host')}/me`;
    // console.log(url);
    await new Email(newUser, url).sendWelcome();

    createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    //1. check that email or password is exist
    if (!email || !password) return next(new AppError('enter the password or email', 400));

    //2. check user exist or pass is correct
    const user = await User.findOne({ email }).select('+password');

    //here user.password = "$2b$12$lOGZY0JFgdOO4b2Y8VTEEu1/qwNIr/tLVlXdkknt1iqJO1/.4XSJq" this form 
    //and the login pass is "Harshul@12345" 
    //so how can we compare this 
    //SOLUTION => by using the bcrypt.compare()

    if (!user || !(await user.correctPassword(password, user.password))) {    //user exist krega tbhi pass check hoga
        return next(new AppError('incorrect email or password', 401));
    }

    //3. if all ok then sent the jwt token to client

    createSendToken(user, 201, res);
})

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedOut', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    })
    res.status(200).json({ status: 'success' });
}

exports.protect = catchAsync(async (req, res, next) => {
    //1 Getting token and check of its there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {  //Note : express convert all header into lowercase
        token = req.headers.authorization.split(' ')[1];
    }
    else if (req.cookies.jwt) {  //check that token present in cookie or not
        token = req.cookies.jwt
    }
    // console.log(req.headers.authorization);
    if (!token) return next(new AppError('You are not logged in ! please loggen in to get access', 401))

    //2. verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    if (!decoded) return next(new AppError("access deny. please login again to access this resourse", 401))

    //3 check if user still exists (means appko token issue hone ke baad aapne user delete kr diya ho)
    // console.log(decoded);
    const currUser = await User.findById(decoded.id);
    if (!currUser) return next(new AppError('user belonging to this token does not longer exists(user is deleted) ', 401));

    //4 check if user changed password after the token was issued
    if (currUser.changePasswordAfter(decoded.iat)) {
        return next(new AppError('user recently change password! so please try again. ', 401));
    }

    //GRANT ACCESS TO PROTECTED ROUTE
    req.user = currUser;
    res.locals.user = currUser;
    next();
})

//ONLY FOR RENDERED PAGES ! NO ERRORS
exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            //1) verify token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

            //2) check if user still exists (means appko token issue hone ke baad aapne user delete kr diya ho)
            const currUser = await User.findById(decoded.id);
            if (!currUser) return next();

            //3) check if user changed password after the token was issued
            if (currUser.changePasswordAfter(decoded.iat)) {
                return next();
            }

            //THERE IS THE LOGGED USER
            res.locals.user = currUser;  //here res.local.x here x can be access by all the pub template as a variable
            return next();
        } catch (err) {
            return next();
        }
    }
    next(); //if not cookie then next middleware is called
}

exports.restrictTo = (...roles) => {
    return (req, res, next) => {   //i am create the closure (i am still use the varible of parent func when it is executed completely)
        if (!roles.includes(req.user.role)) {
            return next(new AppError('you do not have permission to perform this action', 403))
        }
        next();
    }
}


exports.forgetPassword = catchAsync(async (req, res, next) => {
    //1) get user based on posted email
    const user = await User.findOne({ email: req.body.email })

    if (!user) return next(new AppError('there is no user with this email', 404));

    //2) generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    //3) send it to user email
    try {
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
        await new Email(user, resetUrl).sendPasswordReset();
        
        res.status(200).json({
            status: "success",
            message: 'Token sent to email'
        })
    }
    catch (err) {
        // console.log("email err", err);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new AppError("there was an error sending in email ! please try again later", 500));
    }


})

exports.resetPassword = catchAsync(async (req, res, next) => {

    //1. get user based on the token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

    //2. if token has not expired and user is there then set the new password
    if (!user) return next(new AppError('token is invalid or expired', 400));
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    //3. update the changedPasswordAt property from the user 
    //for this step we creat ethe middleware in the userModel.js

    //4. log the user in and generate jwt
    createSendToken(user, 200, res)
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    //1. Get User from collection
    // console.log("hii");
    const user = await User.findById(req.user.id).select('+password');

    //2. check if posted current password is correct
    if (!(await user.correctPassword(req.body.oldPassword, user.password))) {
        return next(new AppError('your old password is wrong', 401));
    }

    //3. if so, update password
    user.password = req.body.newPassword;
    user.passwordConfirm = req.body.newPasswordConfirm;
    await user.save();
    //here we not use User.findByIdAndUpdate()  becose in this case we not use save event middleware (it worrks on .create and .save)

    //4. log user in , send JWT
    createSendToken(user, 200, res);
})





