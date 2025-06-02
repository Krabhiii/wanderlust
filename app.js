const MongoStore = require("connect-mongo");
{if(process.env.NODE_ENV != "production"){
require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsmate = require("ejs-mate");
const Joi = require('joi');
const methodoverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const MongoStore = require('connect-mongo');
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const expresserror = require("./util/expresserror.js");
const Review = require("./models/review.js");
const passport = require("passport");
const Localstrategy = require("passport-local");
const user = require("./models/user.js");
const users = require("./routes/users.js");


// Set up EJS and static files
app.engine("ejs", ejsmate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodoverride("_method"));app.use('/uploads', express.static('uploads'));


// Database connection
const dburl = process.env.ATLAS_DB;
async function Main() {
    await mongoose.connect(dburl);
}
Main()
    .then(() => {
        console.log("connection is successful");
    })
    .catch((err) => {
        console.log(err);
    });
const store = MongoStore.create({
    mongoUrl:dburl,
    crypto :{
        secret:process.env.SECRET
    },
    touchAfter: 24*3600
});

// Session and flash configuration
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
// Flash message middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curruser = req.user;
    next();
});
// Use routes
app.use("/",users);
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

// Error Handler Route
app.use((err, req, res, next) => {
    if (err.name === "CastError") {
        err.statuscode = 405;
        err.message = `Invalid ${err.path}: ${err.value}. Please provide a valid value.`;
    }
    const { statuscode = 500, message = "something went wrong" } = err;
    res.status(statuscode).send(message);
});

// Start server
app.listen(3000, () => {
    console.log("app is listening ");
});}