const mongoose = require('mongoose');
const profileSchema = new mongoose.Schema({
    user_profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    marital: {
        type: String
    },
    age: {
        type: Number
    },
    bio: {
        type: String
    },
    image: { 
        type: String
    }
}, { timestamps: true });
module.exports = mongoose.model('profile', profileSchema);