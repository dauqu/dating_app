const express= require("express");
const router= express.Router();
const testimonialSchema= require("./../models/testimonials");
const jwt= require("jsonwebtoken");

router.post("/", async(req,res)=>{
    const {testimonial}= req.body;
    let id = await log_validate(req);
    const testimonial_collection = new testimonialSchema({
        user_testimonial: id,
        testimonial
    });
    try {
        await testimonial_collection.save();
        res.status(200).json({message: "Testimonial added successfully", data: testimonial_collection});
    } catch (error) {
        res.send(error)
    }
})

//get all testimonials
router.get("/get-testimonials", async(req,res)=>{
    const testimonials= await testimonialSchema.find().populate([
        {
            path:'user_testimonial',
            //concatenate the user's name and surname
            select: {name: {$concat: ["$fname", " ", "$lname"]}},
            populate: {
                path: 'profile',
                select: ['image']
            }
        },
    ]);
    res.send(testimonials)
})

//extract the user id from the token and using it in the post route
async function log_validate(req){
    const token = req.cookies.auth_token || req.body.token || req.headers['x-auth-token'];
    // console.log(token)
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided", status: "error" });
    }
    const valid_token = jwt.verify(token, process.env.JWT_SECRET, {
        expiresIn: "1y",
        algorithm: "HS256"
    });
    if (!valid_token) return res.status(401).json({ message: "Invalid token" });
    const id_from_token = valid_token._id;
    return id_from_token;
}

module.exports= router;