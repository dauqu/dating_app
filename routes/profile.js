const express = require('express');
const router = express.Router();
const profileSchema = require('./../models/profile');
const users_schema = require('./../models/users');
const jwt= require("jsonwebtoken")


router.post("/", async(req, res) => {
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
    // console.log(id_from_token)
    const { marital, age, bio, image } = req.body;
    try {
        let create_profile = new profileSchema({
            user_profile: id_from_token,
            marital,
            age,
            bio,
            image
           
        });
        let user= await users_schema.findById(id_from_token);

        user.profile= create_profile._id;
        
        await user.save();
        await create_profile.save();
        
        res.status(200).json({ message: "Profile created successfully", data: create_profile });
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }

});

//get all profiles
router.get("/", async(req, res) => {
    try {
        const profiles = await profileSchema.find({}).populate([{path: 'user_profile'}]);
        res.json({profiles});
    } catch (error) {
        res.send(error)
    }
});

//get last added profiles
router.get("/last-added-profiles", async(req,res)=>{
    const last_added_profiles= await profileSchema.find().populate({path:'user_profile'}).sort({updatedAt: -1});
    res.send(last_added_profiles)
})


//update profile
router.put("/:id", async(req, res) => {
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
    const { marital, age, bio, image } = req.body;
    try {
        let profile = await profileSchema.findById(req.params.id);
        if (!profile) return res.status(404).json({ message: "Profile not found" });
        if (profile.user_profile.toString() !== id_from_token) {
            return res.status(401).json({ message: "Not authorized" });
        }
        profile.marital = marital;
        profile.age = age;
        profile.bio = bio;
        profile.image = image;
        await profile.save();
        res.status(200).json({ message: "Profile updated successfully", data: profile });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
});

//delete profile
router.delete("/:id", async(req, res) => {
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
    try {
        let profile = await profileSchema.findById(req.params.id);
        if (!profile) return res.status(404).json({ message: "Profile not found" });
        if (profile.user_profile.toString() !== id_from_token) {
            return res.status(401).json({ message: "Not authorized" });
        }
        await profile.remove();
        res.status(200).json({ message: "Profile deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
});

//validation for profile
async function validateProfile(req, res, next) {
    const { marital, age, bio, image } = req.body;
    if (
        marital === undefined || marital === "" || marital === null ||
        age === undefined || marital === "" || marital === null ||
        bio === undefined ||marital === "" || marital === null ||
        image === undefined || marital === "" || marital === null
    ) 
    {
        return res.status(400).json({ message: "Please fill all fields" });
    }
    next();
}
        
    
    




module.exports = router;