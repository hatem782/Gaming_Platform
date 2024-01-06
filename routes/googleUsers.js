var express = require('express');
var router = express.Router();
const passport = require('passport')
const configureGoogleAuth = require('../controllers/googleUsers.js');

configureGoogleAuth(passport);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: "/", // Redirect to the home page on success
        failureRedirect: "/", // Redirect to the login page on failure
    })
);
module.exports = router;