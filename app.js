//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

// const session = require('express-session');
// const passport = require("passport");
// const passportLocalMongoose = require("passport-local-mongoose");
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
// const findOrCreate = require('mongoose-findorcreate');


const app = express();

// console.log(process.env.API_KEY);

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

 // no longer a simple javascript object, now by using new mongooose.Schema we are creating a mongoose Schema object
 // where before we used a simple javascript object.

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

// This is the encrption key, secret



// Here we add mongoose encrypt as a plug in to our schema and we're gonna pass over our secret as a Javascript object.

userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });

const User = new mongoose.model("User", userSchema);

app.get("/", function(req, res){
  res.render("home");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.get("/register", function(req, res){
  res.render("register");
});

// User enters email and password on the register.ejs page and it is posted through
// our form data variables, username and password

app.post("/register", function(req, res){

  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  newUser.save(function(err) {
    if (!err) {
      res.send("Successfully addded a new user.");


      // res.render("secrets");
    } else {
      console.log(err);
    }

  });



});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({email: username}, function(err, foundUser){
    if(err) {
      console.log(err);
    }  else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        }

      }
    }

  })
})

app.listen(3000, function() {
  console.log("Server started on port 3000.");
});
