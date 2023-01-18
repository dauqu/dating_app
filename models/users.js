const mongoose = require('mongoose');
const users_schema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirm_password: {
        type: String,
        required: true
    },
    college_name: {
        type: String,
        required: true
    },
    profession: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    profile:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'profile'
    },
    blog:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'blog'
    }]

}, { timestamps: true });

module.exports = mongoose.model('users', users_schema);