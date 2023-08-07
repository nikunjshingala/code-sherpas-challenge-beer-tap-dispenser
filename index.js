const express = require("express");
const app = express();
const port = 3000;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

mongoose.set('strictQuery', false);
const mongoDB = "mongodb://127.0.0.1/beer-tap-dispenser";
(async () => {
    await mongoose.connect(mongoDB);
})().catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/event', require('./routes/event'));
app.use('/dispenser', require('./routes/dispenser'));
app.use('/user', require('./routes/user'));
app.use('/attendee', require('./routes/attendee'));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
});