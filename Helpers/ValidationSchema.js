const Joi = require('@hapi/joi')

const authorizationSchema =Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(2).required(),
    username:Joi.string(),
    firstname:Joi.string(),
    lastname:Joi.string(),
    role:Joi.string(),
    gender:Joi.string(),
    height:Joi.string(),
    dateofbirth: Joi.date().iso(),
    weight: Joi.number()
    /*
    trainer_description: Joi.string(),
    trainer_picture: Joi.string(),
    trainer_specialization: Joi.string(),
    workout_name: Joi.string(),
    difficulty_level: Joi.string().valid('Beginner', 'Intermediate', 'Advanced').required(),
    workout_description: Joi.string().required(),
    
    exercise_sets: Joi.array().items(
      Joi.object({
        exercise_name: Joi.string().required(),
        reps: Joi.number().required(),
        rest_time: Joi.number().required(),
      })
    ).required(),
    */
   /*
    goal: Joi.string().required(),
    calories_burned: Joi.number().required(),
    duration: Joi.number().required(),
    workout_price: Joi.number().required(),
    payment_successful: Joi.boolean(),
    workout_thumbnail: Joi.string().required(),
    exercise_name: Joi.string().required(),
    exercise_description: Joi.string().required(),
    exercise_duration: Joi.number().required(),
    exercise_completed: Joi.boolean(),
    exercise_video: Joi.string().uri().required(),
    reps: Joi.number().required(),
    date: Joi.date().required(),
    calories_eaten: Joi.number().integer().min(0).required(),
    daily_calories: Joi.number().integer().min(0).required(),
    weight: Joi.number().required(),
    bmi: Joi.number().required()
    */
    
})

module.exports = {
    authorizationSchema,
}