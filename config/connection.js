require('dotenv').config();
var mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const connectDB = async() => {
    try {
        mongoose.connect(process.env.DATABASE);
        console.log('MongoDB Connected');

        ("mongodb connection failed");
    } catch (error) {
        console.log
    }
}

module.exports = connectDB;