const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const cookieparser= require('cookie-parser')
const cors = require('cors');
// const sendEmail= require('./routes/smtp') //==>form smtp.js

//connect to database
const connectDB = require('./config/connection');
connectDB();

app.use(cors());

//allow json to parsed
app.use(express.json());
app.use(cookieparser());

//routes
app.use("/api/register", require("./routes/register"));
app.use("/api/login", require("./routes/login"));
app.use("/api/add_contact", require("./routes/add_contact"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/testimonial", require("./routes/testimonials"));
app.use("/api/contact", require("./routes/contacts"));//uncomment only if u want to use this file==>form smtp.js
app.use("/api/blog", require("./routes/blog"));


app.use("/api/logout", require("./routes/logout"));

// sendEmail();//uncomment only if u want to use this function ==>form smtp.js
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});