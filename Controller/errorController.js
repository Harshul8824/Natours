const { stack } = require("../app");
const AppError = require("../utils/appError");

const handleJWTError = () => new AppError('Invalid Token ! please log in again',401);

const handleJWTExpired = () => new AppError('your token is expired please log in again',401)


const sendErrorDev = (err,res) =>{
 //operational, trusted error : send message to client
    res.status(err.statusCode).json({
        status : err.status,
        error : err,
        message : err.message,
        stack : err.stack
    });
}

const sendErrorProd = (err,res) =>{
 if(err.isOperational) {
    res.status(err.statusCode).json({
        status : err.status,
        message : err.message,
    })
}
//Programming or other unknown error : don't leak error details
    else{
//1) log error
    // console.log('ERROR', err);

//2) Send generic message
      res.status(500).json({
        status : 'error',
        message : 'something went very wrong'
      })
    }
} 

module.exports = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if(process.env.NODE_ENV === 'development'){
       sendErrorDev(err,res);
    }

    else if(process.env.NODE_ENV === 'production'){
       let error = {...err};

     if(error.name === 'JsonWebTokenError'){
       error = handleJWTError();
     }
    if(error.name === 'TokenExpiredError'){
        error = handleJWTExpired();
    }
       sendErrorProd(error, res);
    }
}


