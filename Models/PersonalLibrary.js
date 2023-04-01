const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const PersonalLibrarySchema = new Schema({
 
    _id: mongoose.Schema.Types.ObjectId,

    username:{
        type: String,
        required: true,
        unique: true
    },
    workouts_purchased:{
        type: String,
        required: true
    },
    goals:{
        type: String,
        required: true
    },
    progress:{
        type: Number,
        required: true
    },    
    notifications:{
        type: String,
        required: true
    },
    workouts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workouts'
      }],
    workoutTracking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WorkoutTracking'
      }
})

const personal_library = mongoose.model('PersonalLibrary', PersonalLibrarySchema);
module.exports = personal_library