const express= require("express")
const router= express.Router()
const contactSchema= require("./../models/contact")
const sendEmail= require("./../utils/sendEmail")
const jwt= require("jsonwebtoken")


router.post("/",validateContact, async(req,res)=>{
    const {name, email, message}= req.body;
    const contact_collection = new contactSchema({
        name,
        email,
        message
    });
    try {
        await contact_collection.save();
        // console.log(contact_collection.email)
        await sendEmail(contact_collection.email, "Cupid Love", "We are so thankful for your message. We will get back to you as soon as possible")
        res.status(200).json({message: "Message sent successfully", data: contact_collection});
    } catch (error) {
        res.send(error)
    }
});

//validation for contact form
async function validateContact(req, res, next){

    //check if user is login or not
    const token = req.cookies.auth_token || req.body.token || req.headers['x-auth-token'];
    if (!token) {
        return res.status(401).json({ message: "Access denied.Please register", status: "error" });
    }
    const valid_token = jwt.verify(token, process.env.JWT_SECRET, {
        expiresIn: "1y",
        algorithm: "HS256"
    });
    if (!valid_token) return res.status(401).json({ message: "Invalid token" });
    // const id_from_token = valid_token._id;

    const {name, email, message}= req.body;
    if(!name || !email || !message){
        return res.status(400).json({message: "Please fill all fields", status: "error"})
    }
    //check if name is valid or not
    if(!/^[a-zA-Z ]{2,30}$/.test(req.body.name)){
        return res.status(400).json({message: "Please enter a valid name", status: "error"})
    }

    //check if email is valid or not
    if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)){
        return res.status(400).json({message: "Please enter a valid email", status: "error"})
    }
    next();
}
module.exports= router;

