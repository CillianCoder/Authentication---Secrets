require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));


mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        if (err) {
            console.log(err);
        } else {
            const newUser = new User({
                email: req.body.username,
                password: hash
            });
            newUser.save()
                .then(() => {
                    res.render("secrets");
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    });
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username })
        .then((foundUser) => {
            bcrypt.compare(password, foundUser.password, function (err, result) {
                if (err) {
                    console.log(err);
                } else if (result) {
                    res.render("secrets");
                } else {
                    // Passwords don't match
                    console.log('Passwords do not match');
                }
            });
        })
        .catch((err) => {
            console.log(err);
        })
});



app.listen(3000, () => {
    console.log("Server started port 3000")
});