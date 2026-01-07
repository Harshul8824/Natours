const express = require('express');
const fs = require('fs');
const Tour = require('./../models/tourModel');
const { json } = require('stream/consumers');
const { match } = require('assert');
const catchAsync = require('./../utils/catchAsync');
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

exports.uploadTourPhoto = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
]);

exports.resizeTourPhoto = catchAsync(async (req, res, next) => {
    // console.log(req.files);
    if (!req.files.imageCover || !req.files.images) return next();

    //imageCover
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${req.body.imageCover}`);

    //image
    req.body.images = [];

    await Promise.all(
        req.files.images.map(async (file, i) => {

            const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

            await sharp(file.buffer)
                .resize(2000, 1333)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`public/img/tours/${filename}`);

            req.body.images.push(filename);
        })
    );

    next();
});


exports.aliasTopTours = (req, res, next) => {
    // console.log("BEFORE:", JSON.parse(JSON.stringify(req.query)));
    req.query.limit = "5";
    req.query.fields = "name,price";
    // console.log("AFTER:", JSON.parse(JSON.stringify(req.query)));
    next();
}


exports.getTourStats = catchAsync(async (req, res, next) => {
    const stats = await Tour.aggregate([
        {
            $match: { ratingsAverage: { $gte: 4.5 } }
        },
        {
            $group: {
                _id: { $toUpper: '$difficulty' },
                numTours: { $sum: 1 },
                numRating: { $sum: "$ratingsQuntity" },
                avgRating: { $avg: "$ratingsAverage" },
                avgPrice: { $avg: "$price" },
                minPrice: { $min: "$price" },
                maxPrice: { $max: "$price" }
            }
        },
        {
            $sort: { avgPrice: 1 }
        },
        // {
        //     $match : {_id : {$ne : 'EASY'}}
        // }
    ])

    res.status(200).json({
        status: "success",
        data: {
            stats
        }
    })
})

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month: "$startDates" },
                numToursStarts: { $sum: 1 },
                tours: { $push: "$name" }
            }
        },
        {
            $addFields: { month: '$_id' }
        },
        {
            $project: {
                _id: 0
            }
        },
        {
            $sort: { numToursStarts: 1 }
        },
        {
            $limit: 100
        }
    ])

    res.status(200).json({
        status: "success",
        data: {
            plan
        }
    })
})

// /tours-within/:distaince/center/:latlng/unit/:unit
// /tours-within/233/center/34.016214,-118.270861/unit/mi
exports.getToursWithin = catchAsync(async (req, res, next) => {
    // console.log("hii i am form getToursWithin");
    // console.log(req.params);
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const dist = Number(distance);
    const latitude = Number(lat);
    const longitude = Number(lng);

    if (Number.isNaN(latitude) || Number.isNaN(longitude) || Number.isNaN(dist)) {
        return next(new AppError('Please provide valid distance and coordinates in the format lat,lng.', 400));
    }

    const radius = unit === 'mi' ? dist / 3963.2 : dist / 6378.1;  //bcoz we want dist in radians for applying query

    //   console.log(dist, latitude, longitude, radius);

    const tours = await Tour.find({
        startLocation: { $geoWithin: { $centerSphere: [[longitude, latitude], radius] } }
    });

    res.status(200).json({
        status: "success",
        length: tours.length,
        data: {
            data: tours
        }
    })
});


exports.getDistances = catchAsync(async (req, res, next) => {
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(',');

    const latitude = Number(lat);
    const longitude = Number(lng);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
        return next(new AppError('Please provide valid coordinates in the format lat,lng.', 400));
    }

    const multiplier = unit === 'mi' ? 0.000621371 : 0.0001;

    const distance = await Tour.aggregate([
        {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [longitude, latitude]
                },
                distanceField: 'distance',
                distanceMultiplier: multiplier
            }
        },
        {
            $project: {
                name: 1,
                distance: 1
            }
        }
    ])


    res.status(200).json({
        status: "success",
        length: distance.length,
        data: {
            data: distance
        }
    })

})

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);
exports.addTour = factory.createOne(Tour);