const express = require('express');
const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const AppError = require('../utils/AppError');
const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');


const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    }
    else {
        cb(new AppError('Not an image! please upload only image', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        .resize(500, 500)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);

    next();
})


const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
}


exports.getMe = (req, res, next) => {  //use for the get Current logged user
    req.params.id = req.user.id;

    next();
}


exports.addUser = (req, res) => {
    res.status(500).json({
        status: "error",
        message: "this route is not yet defined. use /signup route instead"
    });
}

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
//DO NOT UPDATE PASSWORD WITH THIS
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

exports.updateMe = catchAsync(async (req, res, next) => {

    console.log(req.file);
    console.log(req.body);

    //1. ensure that password field is not present in this
    if (req.body.password || req.body.passwordConfirm) {
        return next(new AppError('this route is not for the password update. use this /updatePassword', 400));
    }

    //2. filter out unwanted fields name which is not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email');
    console.log(req.file);
    if (req.file) filteredBody.photo = req.file.filename;
    // console.log(filteredBody);

    //update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,  //create new Obj
        runValidators: true //apply all validation rules on updatedUser
    });

    res.status(200).json({
        status: "success",
        data: {
            user: updatedUser
        }
    })
})

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: "success",
        data: null
    })
});