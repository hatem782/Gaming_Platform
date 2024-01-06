var express = require('express');
var router = express.Router();
const passport = require('passport')
const configureFacebookAuth = require('../controllers/facebookUsers.js')

configureFacebookAuth(passport);

router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));

router.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
        successRedirect: "/", // Redirect to the home page on success
        failureRedirect: "/", // Redirect to the login page on failure
    })
);
module.exports = router;