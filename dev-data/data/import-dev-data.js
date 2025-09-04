const dotenv = require('dotenv')
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('./../../models/tourModel');

dotenv.config({path : './config.env'});

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);
// console.log(DB);
mongoose.connect(DB)
.then(con =>{
    console.log(con.connections);
    console.log("DB connnection successfully");
})
.catch(err =>{
    console.log("db connection error",err);
})

const TourData = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

//to import data in DB
const importData = async() =>{
    try{
        await Tour.create(TourData);
        console.log("data import successfully in DB");
        process.exit();
    }
    catch(err){
        console.log(err);
    }
}

//to delete complete data from DB
const deleteData = async() =>{
    try{
        await Tour.deleteMany();
        console.log("all data delete successfully in DB")
        process.exit();
    }
    catch(err){
        console.log(err);
    }
}

if(process.argv[2] === '--import'){
    importData();
}
if(process.argv[2] === '--delete'){
    deleteData();
}

console.log(process.argv);
