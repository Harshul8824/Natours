const express = require('express');

const app = express();

const port = 3000;

app.get('/', (req, res) => {
    // res.status(200).send("What up buddy 😍. i am sending resource you which you want to access!");
    res.status(200).json({
        status : "success",
        message : "What up buddy 😍. i am sending resource you which you want to access!"
    })
})

app.post('/', (req, res) => {
    // res.status(200).send("you posted something here buddy!")
    res.status(200).json({
        status : "success",
        message : "you posted something here buddy!"
    })
})


app.listen(port, () => {
    console.log(`server is running on ${port}`);
})