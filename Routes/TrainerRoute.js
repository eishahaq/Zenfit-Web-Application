const express = require('express');
const router = express.Router();
const Trainer = require("../Models/Trainer");
const mongoose = require('mongoose');
const createError = require('http-errors')
const { authorizationSchema } = require('../Helpers/ValidationSchema')
const bcrypt = require('bcrypt');
const { signAccessToken, signRefreshToken, verifyRefreshToken, verifyAccessToken } = require('../Helpers/JwtHelper')


// Add the trainer
router.post('/signup', async (req, res, next) => {
  try {
      const result = await authorizationSchema.validateAsync(req.body)
      const doesExist = await Trainer.findOne({ email: result.email })
      if (doesExist) throw createError.Conflict(`${result.email} has already been registered`)

      const trainer = new Trainer({
          _id: new mongoose.Types.ObjectId,
          username: result.username,
          firstname: result.firstname,
          lastname: result.lastname,
          dateofbirth: result.dateofbirth,
          gender: result.gender,
          role:result.role,
          status:"ACTIVE",
          password: result.password,
          email: result.email,
          trainer_description: result.trainer_description,
          trainer_picture: result.trainer_picture,
          trainer_specialization: result.trainer_specialization
      })
      const savedTrainer = await trainer.save()
      const accessToken = await signAccessToken(savedTrainer.id)
      const refreshToken = await signRefreshToken(savedTrainer.id)
      res.send({ accessToken,refreshToken })
  } catch (error) {
      if (error.isJoi === true) error.status = 422
      next(error)
  }
})


// Get all the trainers
router.get('/', verifyAccessToken,(req, res, next) => {

Trainer.find()
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

// Get all the trainers
router.get('/', verifyAccessToken,(req, res, next) => {

  Trainer.find()
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
// Get all the trainers
router.get('/', verifyAccessToken,(req, res, next) => {

  Trainer.find()
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

// Get trainer by ID
router.get('/:id', verifyAccessToken, (req, res, next) => {

  const trainerId = req.params.id;

  Exercise.findById(trainerId)
    .exec()
    .then(result => {
      if (result) {
        res.status(200).json({
          exercise: result
        });
      } else {
        res.status(404).json({
          message: 'Trainer not found'
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


//DELETE REQUEST

router.delete('/:id', verifyAccessToken, async (req, res, next) => {

  User.findOneAndUpdate({ trainer_id: req.params.id }, {
      $set: {
          status: "INACTIVE"
      }
  })
  .then(result => {
      res.status(200).json({
          updated_user: result,
          message: "Trainer has been removed"
      })
  })
  .catch(err => {
      console.log(err);
      res.status(500).json({
          error: err
      })
  })
})


router.post('/refresh-token', async (req, res, next) => {
  try {
      const { refreshToken } = req.body
      if (!refreshToken) throw createError.BadRequest()
      const userId = await verifyRefreshToken(refreshToken)

      const accessToken = await signAccessToken(userId)
      const refToken = await signRefreshToken(userId)
      res.send({ accessToken: accessToken, refreshToken: refToken })

  } catch (error) {
      next(error)

  }
})

router.get('/trainer/clients/:id', verifyAccessToken, async (req, res, next) => {
  try {
    const trainer = await Trainer.findById(req.params.id).populate('clients');
    if (!trainer) {
      return res.status(404).json({
        message: 'Trainer not found'
      });
    }
    res.json({
      clients: trainer.clients
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


module.exports = router;