const express = require('express');
const router = express.Router();
const add_contact_schema = require('./../models/add_contact');

router.post("/", validate_contact, async(req, res) => {
    const { full_name, phone, email } = req.body;
    const save_contact = new add_contact_schema({
        full_name,
        phone,
        email
    });
    try {
        await save_contact.save();
        res.status(200).json({
            message: "Contact added successfully",
        });
    } catch (error) {
        res.status(400).json({ message: error.message, status: "error" });

    }
});

//get all contacts
router.get("/", async(req, res) => {
    try {
        const contacts = await add_contact_schema.find();
        res.status(200).json({
            message: "All contacts",
            contacts
        });
    } catch (error) {
        res.status(400).json({ message: error.message, status: "error" });
    }
});

//get single contact
router.get("/:id", async(req, res) => {
    try {
        const contact = await add_contact_schema.findById(req.params.id);
        res.status(200).json({
            message: "Single contact",
            contact
        });
    } catch (error) {
        res.status(400).json({ message: error.message, status: "error" });
    }
});

//update contact
router.put("/:id", validate_contact, async(req, res) => {
    try {
        const contact = await add_contact_schema.findByIdAndUpdate(req.params.id, {
            full_name: req.body.full_name,
            phone: req.body.phone,
            email: req.body.email
        }, { new: true });
        res.status(200).json({
            message: "Contact updated successfully",
            contact
        });
    } catch (error) {
        res.status(400).json({ message: error.message, status: "error" });
    }
});

//delete contact
router.delete("/:id", async(req, res) => {
    try {
        const contact = await add_contact_schema.findByIdAndDelete(req.params.id);
        res.status(200).json({
            message: "Contact deleted successfully",
            contact
        });
    } catch (error) {
        res.status(400).json({ message: error.message, status: "error" });
    }
});

//validation for contact
async function validate_contact(req, res, next) {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided", status: "error" });
    }



    const { full_name, phone, email } = req.body;
    if (full_name == null || full_name == "" || full_name == undefined ||
        phone == null || phone == "" || phone == undefined ||
        email == null || email == "" || email == undefined) {
        return res.status(400).json({ message: "Please fill all fields", status: "error" });
    }

    //check full name is valid or not
    if (!/^[a-zA-Z ]{2,30}$/.test(req.body.full_name)) {
        return res.status(400).json({ message: "Please enter a valid name", status: "error" });
    }

    //check email is valid or not
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)) {
        return res.status(400).json({ message: "Please enter a valid email", status: "error" });
    }

    //check phone number is valid or not
    if (!/^[0-9]{10}$/.test(req.body.phone)) {
        return res.status(400).json({ message: "Please enter a valid phone number", status: "error" });
    }

    next();
}


module.exports = router;