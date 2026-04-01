const express = require('express');
const { json } = require('stream/consumers');
const morgan = require('morgan');
const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');
const reviewRouter = require('./Routes/reviewRoutes');
const globalErrorHandler = require('./Controller/errorController');
const AppError = require('./utils/AppError');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const path = require('path');
const viewRouter = require('./Routes/viewRoutes');
const bookingRouter = require('./Routes/bookingRoutes');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors')

const app = express();

app.set('view engine', 'pug');   //using this we can render .pug file using res.render()
app.set('views', path.join(__dirname, 'views'));  //set the directory where your views file lives

app.use(cors({
  origin : 'http://localhost:5173',
  credentials : true
}));

// // Find your CSP middleware and update it
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", 'https://*.razorpay.com'],
      scriptSrc: ["'self'", "https://unpkg.com", 'https://*.razorpay.com'],
      styleSrc: ["'self'", "'unsafe-inline'", "https://unpkg.com", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: [
        "'self'",
        "data:",
        "https://*.tile.openstreetmap.org",
        "https://unpkg.com",
        "https://*.razorpay.com"
      ],
      connectSrc: ["'self'", "https://*.tile.openstreetmap.org", "https://*.razorpay.com", "https://api.razorpay.com"],
      frameSrc: ["'self'", "https://*.razorpay.com"]
    }
  })
);


//SET SECURITY HTTP HEADERS
// app.use(helmet());

//PARSE URL STRING IN ADVANCED FILTERING(nested objects)
app.set('query parser', 'extended');

//DEVELOPMENT LOGGING
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//LIMIT REQUEST FROM SAME API (for apply DOS(deny of service))
const limiter = rateLimit({
  limit: 100,  //set req limit
  windowMs: 60 * 60 * 1000  //no. of req per hour
})
app.use('/api', limiter);

//BODY PARSER, READING DATA FROM BODY INTO REQ.BODY
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }))
app.use(cookieParser());

app.use((req, res, next) => {
  // copy current query into a plain object and redefine the property
  Object.defineProperty(req, 'query', {
    value: { ...req.query },
    writable: true,
    configurable: true,
    enumerable: true,
  });
  next();
});

//DATA SANITIZATION AGAINST NOSQL QUERY IJECTION
app.use(mongoSanitize());

//DATA SANITIZATION AGAINST XSS(cross site scripting)
app.use(xss());

//PREVENT HTTP PARAMETER POLLUTION
app.use(
  hpp({
    whitelist: [
      'duration',
      'price',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty'
    ]
  })
)

//SERVING STATIC FILES
app.use(express.static(path.join(__dirname, 'public')));  // It tells Express: “Serve everything inside the public folder directly to the browser.”

app.use(compression());

// TEST MIDDLEWARES
// app.use((req,res,next)=>{
//     console.log("hii i am from the middleware👋");
//     console.log(req.cookies);
//     next();
// })

app.use((req, res, next) => {
  req.reqTime = new Date();
  //  console.log(req.headers);
  // console.log(req.cookies);
  next();
})

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

//FOR ALL OTHER ROUTES
app.all('{*splat}', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

//CENTRALIZED ERROR HANDLING MECHANISM
app.use(globalErrorHandler)

module.exports = app;