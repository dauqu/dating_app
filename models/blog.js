const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    blog_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
    },
    title: {
        type: String,
       
    },
    description:{
        type: String,
       
    },
    body: {
        type: String,
       
    },
}, {timestamps: true});
module.exports = mongoose.model('blog', blogSchema);
