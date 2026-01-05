const AppError = require("../utils/AppError");


const handleJsonWebTokenError = err => new AppError('invalid token ! please login again', 401);

const handleTokenExpiredError = err => new AppError('your token is expired please login again', 401);

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `invalid input data : ${errors.join('. ')}`;
  return new AppError(message, 400);
}

const handleDuplicatesFieldsDB = (err) => {
  const value = err.keyValue[field];
  const message = `duplicates fields value ${value}. please use another value`
  return new AppError(message, 400)
}

const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path} : ${err.value}`;
  return new AppError(message, 400);
}

const SendErrorDev = (err, req, res) => {
  //A) API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      erorr: err,
      stack: err.stack
    });
  }

  //RENDERED WEBSITE
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message
  })
}

const SendErrorProd = (err, req, res) => {
  //API
  // console.log(req.originalUrl);
  if (req.originalUrl.startsWith('/api')) {
    //A) OPERATIONAL AND TRUSTED ERROR SEND MESSAGE TO CLIENT
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    //B) PROGRAMMING OR OTHER UNKNOWN ERROR: DON'T LEAK ERROR DETAILS
    //1) LOG ERROR
    console.error('Error 💥', err);

    //2) SEND GENE  RIC MESSAGE
    return res.status(500).json({
      status: "error",
      message: "something went very wrong!"
    })
  }

  //RENDERED WEBSITE
  //A) operational trusted error : send message to client
  console.error(err);
  if (err.isOperational) {
    res.status(err.statusCode).render('error', {
      title: "something went wrong",
      msg: err.message
    });
  };

  //B) PROGRAMMING OR OTHER UNKNOWN ERROR: DON'T LEAK ERROR DETAILS 
  //1)LOG ERROR 
  console.error('Error 💥', err);
  //2) send generic message
  if (err.isOperational) {
    res.status(err.statusCode).render('error', {
      title: "something went wrong",
      msg: 'please try again later'
    });
  };
}


module.exports = (err, req, res, next) => {    //4 argument middleware == error handling middleware
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error'

  if (process.env.NODE_ENV == "development") {
    SendErrorDev(err, req, res);
  }
  else if (process.env.NODE_ENV == "production") {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === '11000') error = handleDuplicatesFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJsonWebTokenError(error);
    if (error.name === 'TokenExpiredError') error = handleTokenExpiredError(error);

    SendErrorProd(error, req, res);
  }
}
