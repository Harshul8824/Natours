const express = require('express')
const fs = require('fs');
const { json } = require('stream/consumers');
const morgan = require('morgan');
const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./Controller/errorController');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');


const app = express();

//Global Middlewares

//set security http headers
app.use(helmet()); //middleware for Express.js that helps secure your app by setting various HTTP headers

//development logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));  //we use the third party middleware
}

//limit request from same API
const limiter = rateLimit({
    max : 100,
    windowMs : 60*60*1000,
    message : 'Too many request from this IP, please try again in an hour'
})
app.use('/api', limiter);

// Middleware to parse JSON request bodies
app.use(express.json({limit : '10kb'}));

//data sanitization against noSQL query injection
app.use(mongoSanitize());

//data sanitization against XSS
app.use(xss());

//prevent parameter pollution 
app.use(hpp({
    whitelist :[
        "duration",
        "maxGroupSize",
        "difficulty",
        "ratingAverage",
        "ratingQuantity",
        "price"
    ]
}));

//serving Static files
app.use(express.static(`${__dirname}/public`));

//test middleware
app.use((req,res, next)=>{
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);

    next();
})

//*Creating and Mounting Multiple Routes   //we move this on file
app.use('/api/v1/tours', tourRouter); //mount router module on path (parent route)
// //so here when the req enter in this middleware then this assign the route '/api/v1/tours' in test router
app.use('/api/v1/users', userRouter);

//for unknown route
app.all('*',(req,res,next)=>{
    // const err = new Error(`can't find ${req.originalUrl} on this server`);
    // err.statusCode = 404;
    // err.status = "Fail";

    next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
})

//Error Handling Middleware
app.use(globalErrorHandler)

module.exports = app;