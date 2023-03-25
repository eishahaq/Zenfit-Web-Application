const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const {verifyAccessToken } = require('../Helpers/JwtHelper');
const PersonalLibrary = require('../Models/PersonalLibrary');
//const WorkoutLibrary = require('../Models/Workouts');
//const WorkoutTracking = require('../Models/WorkoutTracking');
const { signAccessToken, signRefreshToken, verifyRefreshTokens } = require('../Helpers/JwtHelper')


// add a personal library
router.post('/library', verifyAccessToken, (req, res, next) => {
    const personal_library = new PersonalLibrary({
        _id: new mongoose.Types.ObjectId,
        personal_library_id: req.body.personal_library_id,
        username: req.body.username,
        workouts_purchased: req.body.workouts_purchased,
        goals: req.body.goals,
        progress: req.body.progress,
        notifications: req.body.notifications,
        workouts: [],
        workoutTracking: null
      });
    personal_library.save() 
        .then(result => {
            console.log(result);
            res.status(200).json({
                newLibrary: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err

            })
        })
})

// Get all the personal libraries
router.get('/', verifyAccessToken, (req, res, next) => {
    PersonalLibrary.find()
    //    .populate('workouts', 'name description duration')
    //    .populate('workoutTracking', 'start_date end_date completed')
        .exec()
        .then(result => {
            res.status(200).json({
                personal_libraries: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

// get the personal library by its id
router.get('/:id', verifyAccessToken, (req, res, next) => {
    console.log(req.params.id);
    PersonalLibrary.findById(req.params.id)
      //  .populate('workouts', 'name description duration')
     //   .populate('workoutTracking', 'start_date end_date completed')
        .exec()
        .then(result => {
            if (!result) 
                return res.status(404).send('Personal library not found')
            res.status(200).json({
                personal_library: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})

//update the personal library
router.put('/:id', verifyAccessToken, (req, res, next) => {
    console.log(req.body)
    PersonalLibrary.findById(req.params.id)
        .then(library => {
            if (!library) 
                return res.status(404).send('Personal library not found')
            if (library.username !== req.user.username) {
              return res.status(403).send('Forbidden');
            }
            PersonalLibrary.updateOne({ _id: req.params.id }, 
                {
                $set: {
                    personal_library_id: req.body.personal_library_id,
                    username: req.body.username,
                    workouts_purchased: req.body.workouts_purchased,
                    goals: req.body.goals,
                    progress: req.body.progress,
                    notifications: req.body.notifications
                }
            })
                .then(result => {
                    res.status(200).json({
                        updatedLibrary: result
                    })
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    })
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
})


// delete a personal library
router.delete('/:id', verifyAccessToken, (req, res, next) => {
    PersonalLibrary.findOneAndRemove({ personal_library_id: req.params.id, userId: req.user._id })
      .then(result => {
        if (!result) {
          return res.status(404).json({
            message: 'Personal library not found'
          });
        }
        res.status(200).json({
          message: 'Personal library deleted successfully',
          data: result
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
  
