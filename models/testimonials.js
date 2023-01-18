const mongoose = require("mongoose")
const testimonialSchema = new mongoose.Schema({
    user_testimonial:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    testimonial:{
        type: String,
        required: true
    },
}, {timestamps: true})
module.exports= mongoose.model("testimonials", testimonialSchema)