//START SERVER
const dotenv = require('dotenv');
const mongoose = require('mongoose');

if (process.env.NODE_ENV === 'development') {
    process.on('uncaughtException', err => {  //it catch error like console.log(x);
        console.log('uncaught exception ! 💥 shutting down');
        console.log(err);
        console.log(err.name, err.path);
        process.exit(1);
    });
}


// if (process.env.NODE_ENV !== 'production') {
//   dotenv.config({ path: './config.env' });
// }
dotenv.config({ path: './config.env' });

const app = require('./app');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD); //connest atlas db
// const DB = process.env.DATABASE_LOCAL; //connest to local db


mongoose.connect(DB).then(() => {
    console.log("db is connected successfully");
    // console.log(con.connections);
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`server is running on ${port}..`);
});

process.on('unhandledRejection', err => {   //catch errors like wrong mongoDB password
    console.log(err.message, err.name);
    console.log("unhandled rejection ! shutting down 💥");
    server.close(() => {
        process.exit(1);
    });
});

