const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const FitnessTrackSchema = new Schema({
    
    _id: mongoose.Schema.Types.ObjectId,
    date:{
        type: Date,
        required: true
    },
    calories_eaten:{
        type: String,
        required: true
    },
    daily_calories:{
        type: Number,
        required: true
    },
    weight:{
        type: Number,
        required: true
    },
    bmi:{
        type: Number,
        required: true
    }

})    

const fitnesstrack = mongoose.model('FitnessTrack', FitnessTrackSchema);
module.exports = fitnesstrack