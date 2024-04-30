const mongoose = require("mongoose");
const validator = require("validator");
    
const userRoles = require("../utils/userRoles");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validator: [validator.isEmail, "field must be a valid email"]
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: [userRoles.ADMIN, userRoles.USER],
        default: userRoles.USER
    },
    avatar: {
        type: String,
        default: 'images/1.png'
    }
})

module.exports = mongoose.model('User', userSchema);