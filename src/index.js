// express is an server-side web framework for node.js which execute our code on the web
const express = require("express");
//body parser is a middleware, used to process data sent through an HTTP request body.
const bodyParser = require("body-parser");
const route = require("./routes/route.js"); //imported route
const mongoose = require("mongoose"); //ODM library for mongoDB
const app = express(); //Assign express in app variable
const multer = require("multer");
const { AppConfig } = require('aws-sdk');
app.use(multer().any())
app.use(bodyParser.json()); //transforms the text-based JSON input into JS-accessible variables



mongoose.connect(
        "mongodb+srv://Uranium-Batch:aruSjkdGdfhc9MRK@functionup.eel5r.mongodb.net/myIraitech_Assesment", {
            useNewUrlParser: true,
        }
    )
    .then(() => console.log("mongoDB Connected")) //return fullfiled promise
    .catch((err) => console.log(err)); //return rejected promise

app.use("/", route);

//port is two-way communication link between two programs running on the network
app.listen(process.env.PORT || 3000, function() {
    console.log("Express app running on port " + (process.env.PORT || 3000));   
});