const express = require('express');
const { json } = require('stream/consumers');
const morgan = require('morgan');
const tourRouter = require('./Routes/tourRoutes');
const userRouter = require('./Routes/userRoutes');

const app = express();

//MIDDLEWARES

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));  // It tells Express: “Serve everything inside the public folder directly to the browser.” used in Express.js to serve static files

app.use((req,res,next)=>{
    console.log("hii i am from the middleware👋");
    next();
})

app.use((req,res,next)=>{
   req.reqTime = new Date();
   next();
})


//TOUR ROUTES

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour)
// //add sone data in API
// app.post('/api/v1/tours', addTour);

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;