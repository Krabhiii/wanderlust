const express = require("express");
const router  = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/user");
// Signup
router.route("/signup")
.get(userController.renderSignup)
.post(userController.Signup);
// Login
router.route("/login")
.get(userController.renderLogin)
.post(saveRedirectUrl,
    passport.authenticate('local', {failureRedirect: '/login'
        ,failureFlash: true
        ,successFlash: "Welcome back to wanderlust!"
    }),
    userController.login
);
// Logout
router.get("/logout", userController.logout);
module.exports = router;