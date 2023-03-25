
const express = require('express');
const router = express.Router();
const Exercise = require('../Models/Exercise');
const Workout = require('../Models/Workouts');
const mongoose = require('mongoose');
const User = require('../Models/User')
const Trainer = require('../Models/Trainer')
const WorkoutTrack = require('../Models/Workouts');
const Excercise = require('../Models/Exercise')
const jwt = require('jsonwebtoken');
const { signAccessToken, signRefreshToken, verifyRefreshToken, verifyAccessToken } = require('../Helpers/JwtHelper')


//add new workout in the workout library
router.post('/workout', verifyAccessToken, async (req, res, next) => {
    try {
        console.log(req.payload.aud)
      const userId = req.payload.aud
      const trainer = await Trainer.findById(userId)
      console.log(trainer)
      if (!trainer) {
        return res.status(403).json({ message: 'Only trainers can add workouts' })
      }
      const workout = new Workout({
        _id: new mongoose.Types.ObjectId(),
        workout_name: req.body.workout_name,
        difficulty_level: req.body.difficulty_level,
        workout_description: req.body.workout_description,
       // exercise_sets: req.body.exercise_sets,
       // exercises: req.body.exercises,
        goal: req.body.goal,
        calories_burned: req.body.calories_burned,
        duration: req.body.duration,
        workout_price: req.body.workout_price,
        payment_successful: req.body.payment_successful,
        workout_thumbnail: req.body.workout_thumbnail
      })
      const result = await workout.save()
      res.status(200).json({ message: "Workout Posted"})
    } catch (error) {
      next(error)
    }
  })

// Add a new exercise to a workout
// Add a new exercise to a workout
router.post('/workouts/:workoutId/exercises', verifyAccessToken, async (req, res) => {
  const workoutId = req.params.workoutId;

  try {
    const workout = await Workout.findById(workoutId);
    console.log(workout)
    if (!workout) {
      return res.status(404).json({
        message: `Workout with ID ${workoutId} not found`
      });
    }

    const exercise = new Exercise({
      _id: new mongoose.Types.ObjectId(),
      excercise_name: req.body.excercise_name,
      excercise_description: req.body.excercise_description,
      excercise_duration: req.body.excercise_duration,
      excercise_completed: false,
      excercise_video: req.body.excercise_video
    });

    workout.exercises.push(exercise);
    const updatedWorkout = await workout.save(); // <-- await the workout.save() method

    console.log(updatedWorkout);
    res.status(201).json({
      message: 'Exercise added to workout',
      workout: updatedWorkout // <-- send the updated workout in the response
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err
    });
  }
});


// post the tracking
router.post('/tracking', verifyAccessToken, (req, res, next) => {

  const userId = req.payload.aud; // Extract the user ID from the access token
  
  const fitnessTrack = new FitnessTrack({
    _id: new mongoose.Types.ObjectId,
    userId: userId,
    date: req.body.date,
    calories_eaten: req.body.calories_eaten,
    daily_calories: req.body.daily_calories,
    weight: req.body.weight,
    bmi: req.body.bmi
  });

  fitnessTrack.save()
    .then(result => {
      console.log(result);
      res.status(200).json({
        fitness_track: result
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
});
  
//Search the workouts using a search term
router.get('/workouts/search/:search', verifyAccessToken, async (req, res, next) => {
    try {
      const search = req.params.search.toLowerCase();
      
      const workouts = await Workout.find({ name: { $regex: search, $options: 'i' } });
  
      res.json({
        workoutsList: workouts
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
  
//delete the workout
router.delete('/:workout_id',verifyAccessToken, async(req, res, next) => {

    const userId = req.payload.aud
    const trainer = await Trainer.findById(userId)
    console.log(trainer)
    if (!trainer) {
      return res.status(403).json({ message: 'Only trainers can delete workouts' })
    }

    const user = User.findById(req.user.id);
    if (user.role !== 'Trainer') {
      return res.status(403).json({
        message: 'Only trainers can delete the workout'
      });
    }
    
    Workout.remove({ _id: req.params.id })
        .then(result => {
            res.status(200).json({
                message: 'Workout has been deleted',
                result: result
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

//update the workout
router.put('/workout/:id',verifyAccessToken, async (req, res, next) => {

    const userId = req.payload.aud
    const trainer = await Trainer.findById(userId)
    console.log(trainer)
    if (!trainer) {
      return res.status(403).json({ message: 'Only trainers can update the workouts' })
    }

    Workout.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name,
            difficulty_level: req.body.difficulty_level,
            description: req.body.description,
            exercise_sets: req.body.exercise_sets,
            exercises: req.body.exercises,
            goal: req.body.goal,
            calories_burned: req.body.calories_burned,
            duration: req.body.duration,
            price: req.body.price,
            payment_successful: req.body.payment_successful,
            thumbnail: req.body.thumbnail
        }
    }, { new: true })
        .then(result => {
            res.status(200).json({
                updated_workout: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })

        })
})

//Update an exercise in a workout
router.put('/workouts/:workoutId/exercises/:exerciseId',verifyAccessToken, async (req, res, next) => {

    const userId = req.payload.aud
    const trainer = await Trainer.findById(userId)
    console.log(trainer)
    if (!trainer) {
      return res.status(403).json({ message: 'Only trainers can update the excercises' })
    }

    const updatedExercise = {
        name: req.body.name,
        description: req.body.description,
        sets: req.body.sets,
        reps: req.body.reps,
        weight: req.body.weight,
        videoUrl: req.body.videoUrl,
        imageUrl: req.body.imageUrl
    };

    Workout.findOneAndUpdate({ _id: req.params.workoutId, "exercises._id": req.params.exerciseId }, {
        $set: { "exercises.$": updatedExercise }
    })
        .then(result => {
            res.status(200).json({
                message: 'Exercise updated successfully'
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

// Get all the workout
router.get('/workouts',verifyAccessToken, (req, res, next) => {
  Workout.find()
      .exec()
      .then(result => {
          res.status(200).json({
              workout: result
          })
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({
              error: err
          })
      })
});

//get the workout by its id 
router.get('/workouts/:id',verifyAccessToken, (req, res, next) => {
  console.log(req.params.id);
  Workout.findById(req.params.id)
      .populate('exercises')
      .exec()
      .then(result => {
          res.status(200).json({
              workout: result
          })
      })
      .catch(err => {
          console.log(err);
          res.status(500).json({
              error: err
          })
      })
})

// UPDATE a tracking
router.put('/:id', verifyAccessToken, (req, res, next) => {
  const userId = req.payload.aud; // Extract the user ID from the access token
  const trackingId = req.params.id;
  const updateOps = {};
  for (const key of Object.keys(req.body)) {
    updateOps[key] = req.body[key];
  }
  FitnessTrack.updateOne({ _id: trackingId, userId: userId }, { $set: updateOps })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Tracking updated successfully'
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
});

// GET all trackings for a user
router.get('/', verifyAccessToken, (req, res, next) => {
  const userId = req.payload.aud; // Extract the user ID from the access token
  FitnessTrack.find({ userId: userId })
    .exec()
    .then(result => {
      res.status(200).json({
        fitness_track: result
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
});

// GET a specific tracking
router.get('/:id', verifyAccessToken, (req, res, next) => {
  const userId = req.payload.aud; // Extract the user ID from the access token
  const trackingId = req.params.id;
  FitnessTrack.findOne({ _id: trackingId, userId: userId })
    .then(result => {
      if (result) {
        res.status(200).json({
          fitness_track_result: result
        });
      } else {
        res.status(404).json({
          message: 'Tracking not found for this user'
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    })
});




module.exports = router;