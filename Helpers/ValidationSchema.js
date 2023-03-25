const Joi = require('@hapi/joi')

const authorizationSchema =Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(2).required(),
    username:Joi.string().required(),
    firstname:Joi.string().required(),
    lastname:Joi.string().required(),
    role:Joi.string().required(),
    gender:Joi.string().required(),
    height:Joi.string(),
    weight:Joi.string(),
    dateofbirth: Joi.date().iso(),
    trainer_description: Joi.string(),
    trainer_picture: Joi.string(),
    trainer_specialization: Joi.string(),
    workout_name: Joi.string(),
    difficulty_level: Joi.string().valid('Beginner', 'Intermediate', 'Advanced'),
    workout_description: Joi.string(),
    exercise_sets: Joi.array().items(
      Joi.object({
        exercise_name: Joi.string(),
        reps: Joi.number(),
        rest_time: Joi.number(),
      })
    ),
    exercises: Joi.array().items(
      Joi.object({
        exercise_name: Joi.string(),
        muscle_group: Joi.string(),
      })
    ),
    goal: Joi.string(),
    calories_burned: Joi.number(),
    duration: Joi.number(),
    workout_price: Joi.number(),
    payment_successful: Joi.boolean(),
    workout_thumbnail: Joi.string(),
    exercise_name: Joi.string(),
    exercise_description: Joi.string(),
    exercise_duration: Joi.number(),
    exercise_completed: Joi.boolean(),
    exercise_video: Joi.string().uri(),
    exercise_name: Joi.string(),
    reps: Joi.number(),
    date: Joi.date(),
    calories_eaten: Joi.number().integer().min(0),
    daily_calories: Joi.number().integer().min(0),
    weight: Joi.number(),
    bmi: Joi.number()
    
})

module.exports = {
    authorizationSchema
}