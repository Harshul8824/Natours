const app = require('./app')
const dotenv = require('dotenv')
const mongoose = require('mongoose');

dotenv.config({path : './config.env'});

//hosted DB connect with Express App
console.log(process.env);
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);
// console.log(DB);
mongoose.connect(DB)
.then(con =>{
    console.log(con.connections);
    console.log("DB connnection successfully");
})
// .catch(err =>{
//     console.log("db connection error",err);
// }) //instead of this we use middleware to handle all promise rejections 


//local DB connestion
// mongoose.connect(process.env.DATABASE_LOCAL)
// .then(()=> console.log("DB connect successfully"))
// .catch((err)=> console.log("err in DB",err));




const port = process.env.PORT || 3000;

// const port = 3000;
const server = app.listen(port, ()=>{
    console.log(`App runnig on port ${port}...`);
})


process.on('unhandledRejection', err=>{  //handle all promise rejections
    console.log(err.name, err.message);
    console.log("unhandle rejection! Shutting Down...");
    server.close( () =>{ // this give server time to finish all the request
        process.exit(1); //then kill the server
    })
});


process.on('uncaughtException', err=>{  //This listens for any error in your code that wasn’t caught by a try...catch.  and also use to caught synchronous errors
    console.log("uncaught Exception! Shutting Down...");
    server.close( () =>{ // this give server time to finish all the request
        process.exit(1); //then kill the server
    })
})
