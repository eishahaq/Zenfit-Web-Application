const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const ExerciseSchema = new Schema({
    
    _id: mongoose.Schema.Types.ObjectId,  
    exercise_name:{
        type: String,
        required: true
    },
    exercise_description:{
        type: String,
        required: true
    },
    exercise_duration:{
        type: Number,
        required: true
    },
    exercise_completed:{
        type: Boolean
    },
    exercise_video:{
        type: String,
        required: true
    },
    workout: { type: mongoose.Schema.Types.ObjectId, ref: 'Workouts' }

})    


const exercise = mongoose.model('Exercise', ExerciseSchema);
module.exports = exercise;