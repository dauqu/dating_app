const express = require('express');
const router = express.Router();
const profileSchema = require('./../models/profile');

router.post("/", async(req, res) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
        return res.status(401).json({ message: "Access denied" });
    }
    const valid_token = jwt.verify(token, process.env.JWT_SECRET, {
        expiresIn: "1y",
        algorithm: "HS256"
    });
    if (!valid_token) return res.status(401).json({ message: "Invalid token" });
    const id_from_token = valid_token.id;

    const { user, marital, age, bio, image } = req.body;
    try {
        let create_profile = new profileSchema({
            user: id_from_token,
            marital,
            age,
            bio,
            image,
            user
        });
        await create_profile.save();
        res.status(200).json({ message: "Profile created successfully", data: create_profile });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }

});

//get all profiles
router.get("/", async(req, res) => {
    try {
        const profiles = await profileSchema.find().populate({
            path: 'user',
            select: '-password'
        });
        res.json(profiles);
    } catch (error) {

    }
});

module.exports = router;