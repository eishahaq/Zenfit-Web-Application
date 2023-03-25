const mongoose = require('mongoose')
const Schema = mongoose.Schema 
const bcrypt = require('bcrypt')

const CustomerSchema = new Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    weight: {
        type: Number,
        required: true
    },
    height: {
        type: String,
        required: true
    },
    dateofbirth: {
        type: Date,
        required: true
    },
    personal_library: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PersonalLibrary'
  }
})


const customer = mongoose.model('Customer', CustomerSchema)
module.exports = customer