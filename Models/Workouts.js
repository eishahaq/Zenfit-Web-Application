const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const WorkoutLibrarySchema = new Schema({
    
    _id: mongoose.Schema.Types.ObjectId,

      workout_name: {
        type: String,
        required: true,
      },
      difficulty_level: {
        type: String,
        required: true,
        enum: ['Beginner', 'Intermediate', 'Advanced'],
      },
      workout_description: {
        type: String,
        required: true,
      },
      /*
      exercise_sets: {
        type: [
          {
            exercise_name: {
              type: String,
              required: true,
            },
            reps: {
              type: Number,
              required: true,
            },
            rest_time: {
              type: Number,
              required: true,
            },
          },
        ]
       // required: true,
      },
      */
      exercises: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise'
      }],
      goal: {
        type: String,
        required: true,
      },
      calories_burned: {
        type: Number,
        required: true,
      },
      duration: {
        type: Number,
        required: true,
      },
      workout_price: {
        type: Number,
        required: true,
      },
      payment_successful: {
        type: Boolean
      },
      workout_thumbnail: {
        type: String,
        required: true,
      }
    })


    

const workout = mongoose.model('Workouts', WorkoutLibrarySchema);
module.exports = workout

