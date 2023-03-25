const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose');
require('dotenv').config();
const bodyParser = require('body-parser'); 
const createError = require('http-errors')
const { verifyAccessToken } = require('./Helpers/JwtHelper')
const bcrypt = require('bcrypt')
const Trainer = require("./Routes/TrainerRoute");
const User = require("./Routes/UserRoute");
const Exercise = require("./Routes/ExerciseRoute");
const WorkoutLibrary = require("./Routes/WorkoutLibraryRoute");
const PersonalLibrary = require("./Routes/PersonalLibraryRoute");
const FitnessTracking = require("./Routes/FitnessTrackingRoute");

const app = express()

mongoose.set("strictQuery", false);

mongoose.connect('mongodb+srv://Zenfit:j1gJ7JPSCjIWwEe6@cluster0.bjysnrs.mongodb.net/?retryWrites=true&w=majority')


mongoose.connection.on('error',err => {
    console.log('Connection failed'); 
});

mongoose.connection.on('connected',connected=>{
    console.log('Connected with database sucessfully'); 
})

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()); 


app.use('/User', User);
app.use('/Trainer', Trainer);
app.use('/Exercise', Exercise);
app.use('/WorkoutLibrary', WorkoutLibrary);
app.use('/PersonalLibrary', PersonalLibrary);
app.use('/FitnessTracking', FitnessTracking);

app.get('/', verifyAccessToken, async (req, res, next) => {
    res.send("Hello from express.")
})


app.use((err,req,res,next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            status: err.status || 500,
            message: err.message,
        },
    })
})


const PORT = 8000


app.listen(PORT, () => {
    console.log('Server running on port 8000')
})

module.exports = app;