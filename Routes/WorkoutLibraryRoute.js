const express = require('express');
const router = express.Router();
const Exercise = require('../Models/Exercise');
const Workout = require('../Models/Workouts');
const mongoose = require('mongoose');
const User = require('../Models/User')
const Trainer = require('../Models/Trainer')
const WorkoutTrack = require('../Models/Workouts');
const jwt = require('jsonwebtoken');
const { signAccessToken, signRefreshToken, verifyRefreshToken, verifyAccessToken } = require('../Helpers/JwtHelper')


//add new workout in the workout library
router.post('/workout', verifyAccessToken, (req, res, next) => {
    try {
        console.log(req.payload.aud)
      const userId = req.payload.aud
      const trainer = Trainer.findById(userId)
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
        goal: req.body.goal,
        calories_burned: req.body.calories_burned,
        duration: req.body.duration,
        workout_price: req.body.workout_price,
        payment_successful: req.body.payment_successful,
        workout_thumbnail: req.body.workout_thumbnail
      })
      const result = workout.save()
      res.status(200).json({ message: "Workout Posted"})
    } catch (error) {
      next(error)
    }
  })

// post the tracking
router.post('/WorkoutTracking',verifyAccessToken,(req, res, next) => {
const workoutTrack = new WorkoutTrack({
    _id: new mongoose.Types.ObjectId,
    workout_id: req.body.workout_id,
    percentage: req.body.percentage,
    goals_completed: req.body.goals_completed,
    calories_burned: req.calories_burned,
    notes: req.body.notes
})
workoutTrack.save() 
    .then(result => {
        console.log(result);
        res.status(200).json({
            newWorkoutTrack: result
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err

        })
    })
})

//Add an exercise 
router.post('/:workoutId/exercises', verifyAccessToken, async (req, res) => {
  const workoutId = req.params.workoutId;

  try {
    const userId = req.payload.aud
    const trainer = Trainer.findById(userId)
    if (!trainer) {
      return res.status(403).json({ message: 'Only trainers can add workouts' })
    }
    const workout = await Workout.findById(workoutId);
    if (!workout) {
      return res.status(404).json({
        message: `Workout with ID ${workoutId} not found`
      });
    }

    const exercise = new Exercise({
      _id: new mongoose.Types.ObjectId,
      exercise_name: req.body.exercise_name,
      exercise_description: req.body.exercise_description,
      exercise_duration: req.body.exercise_duration,
      exercise_completed: false,
      exercise_video: req.body.exercise_video
    });

    const savedExercise = await exercise.save(); // save the exercise document first
    workout.exercises.push(savedExercise); // push the saved exercise document to the workout's exercises array
    const updatedWorkout = await workout.save(); // save the updated workout

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
router.delete('/:workout_id',verifyAccessToken, async (req, res, next) => {

  try {
      const userId = req.payload.aud;
      const user = await User.findById(userId);
      if (!user) {
          return res.status(403).json({ message: 'Invalid user' });
      }
      if (user.role !== 'Trainer' && user.role !== 'Admin') {
          return res.status(403).json({
              message: 'Only trainers and admins can delete the workout'
          });
      }
      
      const result = await Workout.findOneAndRemove({ _id: req.params.workout_id });
      res.status(200).json({
          message: 'Workout has been deleted',
          result: result
      });
  } catch (error) {
      res.status(500).json({
          error: error.message
      });
  }
});

//update the workout
router.put('/workout/:id', verifyAccessToken, async (req, res, next) => {
  try {
    const userId = req.payload.aud;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(403).json({ message: 'Invalid user' });
    }
    if (user.role !== 'Trainer' && user.role !== 'Admin') {
        return res.status(403).json({
            message: 'Only trainers and admins can delete the workout'
        });
    }

    const updatedWorkout = await Workout.findByIdAndUpdate(req.params.id, {
      $set: {
        workout_name: req.body.workout_name,
        difficulty_level: req.body.difficulty_level,
        workout_description: req.body.workout_description,
        exercises: req.body.exercises,
        goal: req.body.goal,
        calories_burned: req.body.calories_burned,
        duration: req.body.duration,
        price: req.body.price,
        workout_price:req.body.workout_price,
        payment_successful: req.body.payment_successful,
        workout_thumbnail: req.body.workout_thumbnail
      }
    }, { new: true });

    res.status(200).json({
      updated_workout: updatedWorkout
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: err
    });
  }
});


//Update an exercise in a workout
router.put('/workouts/:workoutId/exercises/:exerciseId', verifyAccessToken, async (req, res, next) => {

  try {
    const userId = req.payload.aud;
    const user = await User.findById(userId);
    if (!user) {
        return res.status(403).json({ message: 'Invalid user' });
    }
    if (user.role !== 'Trainer' && user.role !== 'Admin') {
        return res.status(403).json({
            message: 'Only trainers and admins can delete the workout'
        });
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

    const workout = await Workout.findOneAndUpdate(
      { _id: req.params.workoutId, "exercises._id": req.params.exerciseId },
      { $set: { "exercises.$": updatedExercise } },
      { new: true }
    );

    if (!workout) {
      return res.status(404).json({ message: 'Workout or exercise not found' });
    }

    res.status(200).json({
      message: 'Exercise updated successfully',
      workout: workout
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Get all the workout
router.get('/workouts',verifyAccessToken, async (req, res, next) => {
  try {
    const workouts = await Workout.find().populate({
      path: 'exercises',
      select: 'exercise_name exercise_description exercise_duration exercise_completed exercise_video'
    }).exec();
    
    res.status(200).json({ workout: workouts });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});


//get the workout by its id 
router.get('/workouts/:id',verifyAccessToken, (req, res, next) => {
  
  console.log(req.params.id);
  Workout.findById(req.params.id)
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
    
module.exports = router;