const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('./../models/tourModel');
const Review = require('./../models/reviewModel');
const User = require('./../models/userModel');

dotenv.config({ path: './config.env' });


const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD); //connest atlas db

mongoose.connect(DB).then(() => {
    console.log("db is connected successfully");
})

const tours = JSON.parse(fs.readFileSync(`${__dirname}/data/tours.json`, 'utf-8'));
const reviews = JSON.parse(fs.readFileSync(`${__dirname}/data/reviews.json`, 'utf-8'));
const users = JSON.parse(fs.readFileSync(`${__dirname}/data/users.json`, 'utf-8'));


//add complete data in DB
const insertData = async () => {
    try {
        console.log("data successfully added");
        await Tour.create(tours);
        await Review.create(reviews);
        await User.create(users, { validateBeforeSave: false });
    }
    catch (err) {
        console.log(err.message);
    }
    process.exit();
}

//delete complete data in DB
const deleteData = async () => {
    try {
        console.log("data successfully deleted");
        await Tour.deleteMany();
        await User.deleteMany();
        await Review.deleteMany();
    }
    catch (err) {
        console.log(err.message);
    }
    process.exit();
}

console.log(process.argv);

if (process.argv[2] === '--import') {
    insertData();
}

if (process.argv[2] === '--delete') {
    deleteData();
}


//want to delete all element from DB
//write query on Terminal "node ./dev-data/import-dev-data.js --delete"
//to add tours-simple.json file data : "node ./dev-data/import-dev-data.js --import"



