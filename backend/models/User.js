const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required.'],
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, 'Password is required.'],
        trim: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }               
});


const User = mongoose.model('User', userSchema);

module.exports = User; 
