const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

//connect to database
const connectDB = require('./config/connection');
connectDB();

//allow json to parsed
app.use(express.json({ extended: false }));


//routes
app.use("/api/register", require("./routes/register"));
app.use("/api/login", require("./routes/login"));
app.use("/api/add_contact", require("./routes/add_contact"));
app.use("/api/profile", require("./routes/profile"));

app.use("/api/logout", require("./routes/logout"));


app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});