const express = require('express');
const fs = require('fs');
const { json } = require('stream/consumers');

const app = express();

app.use(express.json());

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, "utf-8"));

const getAllTours = (req, res) => {
    res.status(200).json({
        status: "success",
        results: tours.length,
        data: {
            tours
        }
    });
}

const getTour = (req, res) => {
    console.log(req.params);
    const id = req.params.id * 1;
    const tour = tours.find(el => el.id === id);
    if(!tour){
        res.status(404).json({
            status : "false",
            message : "invalid id"
        })
    }

    res.status(200).json({
        status : "success",
        data : {
            tour
        }
    })
}

const updateTour = (req,res)=>{
    if(req.params.id * 1 >= tours.length){
        res.status(404).json({
            status : "false",
            message : "invalid id"
        })
    }
    res.status(200).json({
        status : "success",
        data : {
            tour : '<Updated tour here>'
        }
    })
}

const deleteTour = (req,res)=>{
    if(req.params.id * 1 >= tours.length){
        res.status(404).json({
            status : "false",
            message : "invalid id"
        })
    }
    res.status(200).json({
        status : "success",
        data : null
    })
}

const addTour = (req, res) => {
    console.log(req.body);
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

// app.get('/api/v1/tours', getAllTours);
// app.get('/api/v1/tours/:id', getTour);
// app.patch('/api/v1/tours/:id', updateTour);
// app.delete('/api/v1/tours/:id', deleteTour)
// //add sone data in API
// app.post('/api/v1/tours', addTour);

app.route('/api/v1/tours')
.get(getAllTours)
.post(addTour);

app.route('/api/v1/tours/:id')
.get(getTour)
.patch(updateTour)
.delete(deleteTour)


const port = 3000;
app.listen(port, () => {
    console.log(`server is running on ${port}`);
})