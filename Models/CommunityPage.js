const mongoose = require('mongoose')
const Schema = mongoose.Schema 

const CommunityPageSchema = new Schema({
    
    _id: mongoose.Schema.Types.ObjectId,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
    status:{
        type: String,
        required: True
      },
    likes: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
      }],
    comments: [{
      user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
       },
      text: { 
        type: String, 
        required: true 
      }
    }]

})    

const communityPage = mongoose.model('CommunityPage', CommunityPageSchema);
module.exports = communityPage