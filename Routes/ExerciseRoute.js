const express = require('express');
const router = express.Router();
const Exercise = require('../Models/Exercise');
const mongoose = require('mongoose');
const { verifyAccessToken } = require('../Helpers/JwtHelper');
const User = require('../Models/User')
const { signAccessToken, signRefreshToken, verifyRefreshToken} = require('../Helpers/JwtHelper')


// Add an exercise
router.post('/', verifyAccessToken, (req, res, next) => {

  const { exercise_id, exercise_name, exercise_image, exercise_description, exercise_duration, exercise_completion } = req.body;

  const user = User.findById(req.user.user_id);
  if (user.role !== 'Trainer') {
    return res.status(403).json({
      message: 'Only trainers can add the exercises'
    });
  }

  const exercise = new Exercise({
    _id: mongoose.Types.ObjectId,
    exercise_id: exercise_id,
    exercise_name: exercise_name,
    exercise_image: exercise_image,
    exercise_description: exercise_description,
    exercise_duration: exercise_duration,
    exercise_completion: exercise_completion
  });

  exercise.save()
    .then(result => {
      res.status(201).json({
        message: 'Exercise added successfully',
        exercise: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// Get all the exercises
router.get('/', verifyAccessToken, (req, res, next) => {

  Exercise.find()
    .exec()
    .then(result => {
      res.status(200).json({
        exercises: result
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// Get exercise by ID
router.get('/:id', verifyAccessToken, (req, res, next) => {

  const exerciseId = req.params.id;

  Exercise.findById(exerciseId)
    .exec()
    .then(result => {
      if (result) {
        res.status(200).json({
          exercise: result
        });
      } else {
        res.status(404).json({
          message: 'Exercise not found'
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// Update an exercise
router.put('/:id', verifyAccessToken, (req, res, next) => {

  const exerciseId = req.params.id;

  const user = User.findById(req.user.user_id);
  if (user.role !== 'Trainer') {
    return res.status(403).json({
      message: 'Only trainers can update the exercises'
    });
  }

  Exercise.updateOne({ _id: exerciseId }, { $set: req.body })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Exercise updated successfully'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

// Delete an exercise
router.delete('/:id', verifyAccessToken, (req, res, next) => {

  const exerciseId = req.params.id;

  const user = User.findById(req.user.user_id);
  if (user.role !== 'Trainer') {
    return res.status(403).json({
      message: 'Only trainers can delete the exercises'
    });
  }

  Exercise.deleteOne({ _id: exerciseId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Exercise deleted successfully'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
