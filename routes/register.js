const express = require("express");
const router = express.Router();
const UsersSchema = require("./../models/users");
const bcrypt = require("bcryptjs");

router.get("/", async(req, res) => {
    const user = await UsersSchema.find();

    res.json({
        message: "user details",
        data: user
    });
});

router.post("/", validateRegister, async(req, res) => {
    const { fname, lname, email, password, confirm_password, college_name, profession, gender, phone } = req.body;

    // //generate random userid
    // const userid =
    //     Math.random().toString(36).substring(2, 15) +
    //     Math.random().toString(36).substring(2, 15);

    //Hash password
    const hashed_password = await bcrypt.hash(password, 10);

    //Save user to database
    const save_user = new UsersSchema({
        fname,
        lname,
        email,
        password: hashed_password,
        confirm_password,
        college_name,
        profession,
        gender,
        phone,
    });
    try {
        await save_user.save();
        res.status(200).json({
            message: "User created successfully",
        });
    } catch (error) {
        res.status(400).json({ message: error.message, status: "error" });
    }
});

//Middleware for register validation
async function validateRegister(req, res, next) {
    const { fname, lname, email, password, confirm_password, college_name, profession, gender, phone } = req.body;


    //Check if all fields are filled
    if (
        fname === "" || fname === null || fname === undefined ||
        lname === "" || lname === null || lname === undefined ||
        email === "" || email === null || email === undefined ||
        password === "" || password === null || password === undefined ||
        confirm_password === "" || confirm_password === null || confirm_password === undefined ||
        college_name === "" || college_name === null || college_name === undefined ||
        profession === "" || profession === null || profession === undefined ||
        gender === "" || gender === null || gender === undefined ||
        phone === "" || phone === null || phone === undefined



    ) {
        return res
            .status(400)
            .json({ message: "All fields are required", status: "error" });
    }

    //check if password and confirm password match
    if (password !== confirm_password) {
        return res.status(400).json({
            message: "Password and confirm password do not match",
            status: "error",
        });
    }

    //Check password length
    if (password.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters long",
            status: "error",
        });
    }
    //check lname is valid
    const fname_regex = /^[a-zA-Z ]+$/;
    if (!fname_regex.test(fname))
        return res.status(400).json({
            message: "Name is not valid, only alphabets and spaces are allowed",
            status: "error",
        });
    //check lname is valid
    const lname_regex = /^[a-zA-Z ]+$/;
    if (!lname_regex.test(lname))
        return res.status(400).json({
            message: "Name is not valid, only alphabets and spaces are allowed",
            status: "error",
        });

    //Check if user exists
    const user = await UsersSchema.findOne({ email: req.body.email });
    if (user)
        return res.status(400).json({
            message: "Email already exists",
            status: "error",
        });

    //Check email is valid
    const email_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email_regex.test(email))
        return res.status(400).json({
            message: "Email is not valid",
            status: "error",
        });

    // //Check Username is valid
    // const username_regex = /^[a-zA-Z0-9]+$/;
    // if (!username_regex.test(username))
    //     return res.status(400).json({
    //         message: "Username is not valid, only alphabets and numbers are allowed",
    //         status: "error",
    //     });



    // //Check username is unique
    // const user_exists = await UsersSchema.findOne({ username: username });
    // if (user_exists)
    //     return res.status(400).json({
    //         message: "Username is already taken",
    //         status: "error",
    //     });

    //Check phone is valid
    const phone_regex = /^[0-9]{10}$/;
    if (!phone_regex.test(phone))
        return res.status(400).json({
            message: "Phone is not valid",
            status: "error",
        });

    //    "" //Check phone is unique
    //     const phone_exists = await UsersSchema.findOne({ phone: phone });
    //     if (phone_exists)
    //         return res.status(400).json({
    //             message: "Phone is already exists",
    //             status: "error",
    //         });""

    next();
}

module.exports = router;