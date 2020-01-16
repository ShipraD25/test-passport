console.log("api routes loaded")
var db = require("../models");
var express = require("express")
var router = express.Router()
var passport = require("../config/passport");
//Requiring path to so we can use relative routes to our HTML files
​
//Requiring our custom middleware for checking if a user is logged in
var isAuthenticated = require("../config/middleware/isAuthenticated");​
// Using the passport.authenticate middleware with our local strategy.
// If the user has valid login credentials, send them to the members page.
// Otherwise the user will be sent an error
​
router.post("/api/login", passport.authenticate("local"), function(req, res) {
    res.json(req.user);
});
// Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
// how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
// otherwise send back an error
router.post("/api/signup", function(req, res) {
    db.User.create({
            email: req.body.email,
            password: req.body.password
        })
        .then(function() {
            res.redirect(307, "/api/login");
        })
        .catch(function(err) {
            res.status(401).json(err);
        });
});
// Route for logging user out
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
});
// Route for getting some data about our user to be used client side
router.get("/api/user_data", function(req, res) {
    if (!req.user) {
        // The user is not logged in, send back an empty object
        res.json({});
    } else {
        // Otherwise send back the user's email and id
        // Sending back a password, even a hashed password, isn't a good idea
        res.json({
            email: req.user.email,
            id: req.user.id
        });
    }
});​
router.get("/", function(req, res) {
    console.log("route get /")
        // If the user already has an account send them to the members page
        //  if (req.user) {
        //  res.redirect("/members");
        // }
    res.render("signup");
});
router.get("/login", function(req, res) {
    // If the user already has an account send them to the members page
    if (req.user) {
        res.redirect("/members");
    }
    res.render("login");
});
// Here we've add our isAuthenticated middleware to this route.
// If a user who is not logged in tries to access this route they will be redirected to the signup page
router.get("/members", isAuthenticated, function(req, res) {
    res.render("members");
});​
// export routes for server.js to use
module.exports = router;