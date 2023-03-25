const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const TrainerSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trainer_specialization:{
        type: String,
        required: true,
    },
    trainer_picture: {
        type: String
    },
    trainer_description:{
        type: String,
        required:true
    },
    workout_plans: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workouts'
    }],
    clients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }] 
})

const trainer = mongoose.model('Trainer', TrainerSchema);
module.exports = trainer;