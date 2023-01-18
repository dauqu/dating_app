//tinder add contact api
const mongoose = require('mongoose');

const add_contact_schema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
}, { timestamps: true });
module.exports = mongoose.model('add_contact', add_contact_schema);