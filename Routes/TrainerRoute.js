const express = require('express');
const router = express.Router();
const Trainer = require("../Models/Trainer");
const User = require("../Models/User");
const mongoose = require('mongoose');
const createError = require('http-errors')
const { authorizationSchema } = require('../Helpers/ValidationSchema')
const bcrypt = require('bcrypt');
const { signAccessToken, signRefreshToken, verifyRefreshToken, verifyAccessToken } = require('../Helpers/JwtHelper')


// Get all the trainers
router.get('/', async (req, res, next) => {
  try {
    const trainers = await Trainer.find().populate('user', 'username firstname lastname email gender');
    res.send(trainers);
  } catch (error) {
    next(error);
  }
});

// Get trainer by ID
router.get('/trainers/:id', async (req, res, next) => {
  try {
    const trainer = await Trainer.findById(req.params.id).populate('user', 'username firstname lastname email gender');
    if (!trainer) throw createError.NotFound('Trainer not found');
    res.send(trainer);
  } catch (error) {
    next(error);
  }
});

//DELETE REQUEST
router.delete('/:id', verifyAccessToken, async (req, res, next) => {
  try {
    const userId = req.payload.aud;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(403).json({ message: 'Invalid user' });
    }

    const trainerToDelete = await User.findById({_id: req.params.id});
    if (!trainerToDelete) {
      throw createError.NotFound('Trainer not found');
    }

    if (user.role === 'Admin' || (user.role === 'Trainer' && trainerToDelete._id.equals(userId))) {
      const deletedUser = await User.findOneAndUpdate(req.params.id, {
        $set: {
          status: 'INACTIVE',
        },
      });

      if (!deletedUser) {
        throw createError.NotFound('Trainer not found');
      }

      res.status(200).json({
        message: 'Trainer has been removed',
      });
    } else {
      return res.status(403).json({
        message: 'Only Admins can remove trainers and trainers can only remove themsselves',
      });
    }
  } catch (error) {
    next(error);
  }
});


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