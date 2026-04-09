const mongoose = require('mongoose');


//Define the person Schema
const UserSchema = new mongoose.Schema({
    name: {
        type : String,
        required: true
    },

      password: {
    type: String,
    required: true,
    minlength: 6,
  },

    type: {
        type : String,
        enum : ['Learner' , 'Instructor' , 'Broker' , 'Admin'],
        required : true
    },

})

//create person model
const User = mongoose.model('User' , UserSchema);
module.exports = User;