const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true 
    },
    lname: {
        type: String,
        required: true
    },
    enrollment: {
        type: String,
    },
    role: {
        type: String,
        default: 'student'
    },
    sem:{
        type: String,
    },
    branch: {
        type: String,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;