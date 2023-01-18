const express = require('express');
const router = express.Router();
const blogSchema = require('./../models/blog');
const users_schema = require('./../models/users');
const jwt= require("jsonwebtoken")

router.post("/",validateBlog, async(req, res) => {
    const token = req.cookies.auth_token || req.body.token || req.headers['x-auth-token'];
    // console.log(token)
    if (!token) {
        return res.status(401).json({ message: "Access denied. Please register first", status: "error" });
    }
    const valid_token = jwt.verify(token, process.env.JWT_SECRET, {
        expiresIn: "1y",
        algorithm: "HS256"
    });
    if (!valid_token) return res.status(401).json({ message: "Invalid token" });
    const id_from_token = valid_token._id;

    const { title, description, body } = req.body;
    try {
        let create_blog = new blogSchema({
            blog_user: id_from_token,
            title,
            description,
            body
        });
        let user= await users_schema.findById(id_from_token);
        user.blog= create_blog._id;
        
        await user.save();
        await create_blog.save();
        
        res.status(200).json({ message: "Blog created successfully", data: create_blog });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }

});

//validate blog
async function validateBlog(req, res,next) {
   const { title, description, body } = req.body;
   if (title == "" || description == "" || body == "" || 
   title == undefined || description == undefined || body == undefined || 
   title == null || description == null || body == null) {
         return res.status(400).json({ message: "Please fill all fields", status: "warning" });
    }

    
    next();
}
module.exports = router;