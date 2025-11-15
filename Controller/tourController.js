const express = require('express');
const fs = require('fs');

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, "utf-8"));

//Tours ROUTE HANDLERS

//handle the invalid id 
exports.checkId = (req, res, next, val) =>{
      if(val * 1 >= tours.length){
       return res.status(404).json({   //herre return is mandatory becoz this return the resp instead of calling next() function
            status : "false",
            message : "invalid id"
        })
    }
    next();
}

exports.checkBody = (req, res, next)=>{
    console.log(req.body.name);
    if(!req.body.name || !req.body.price){
        return res.status(404).json({
            status : "failed",
            message : "missing name or price"
        })
    }
    console.log("hii i am from the checkbody finc");

    next();
}

exports.getAllTours = (req, res) => {
    console.log(req.reqTime);
    res.status(200).json({
        status: "success",
        requestAt : req.reqTime,
        results: tours.length,
        data: {
            tours
        }
    });
}

exports.getTour = (req, res) => {
    console.log(req.params);
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);

    res.status(200).json({
        status : "success",
        data : {
            tour
        }
    })
}

exports.updateTour = (req,res)=>{
    res.status(200).json({
        status : "success",
        data : {
            tour : '<Updated tour here>'
        }
    })
}

exports.deleteTour = (req,res)=>{

    res.status(200).json({
        status : "success",
        data : null
    })
}

exports.addTour = (req, res) => {
    // console.log(req.body);
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);

    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
        if (err) console.log(err);
        res.status(201).json({
            status: "success",
            data: {
                tour: newTour
            }
        })
    })
}