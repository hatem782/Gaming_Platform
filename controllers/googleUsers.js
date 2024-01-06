const GoogleStrategy = require("passport-google-oauth20");
const UserModel = require("../models/googleUsers.js");
require('dotenv').config();

async function configureGoogleAuthentication(passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        UserModel.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "http://localhost:5000/auth/google/callback",
            },
            async (accessToken, refreshToken, profile, cb) => {
                try {
                    console.log(profile);
                    const existingUser = await UserModel.findOne({ googleId: profile.id });

                    if (existingUser) {
                        // Update existing user information:
                        const updatedUser = {
                            fullname: profile.displayName,
                            email: profile.emails[0].value,
                            pic: profile.photos[0].value,
                            secret: accessToken
                        };
                        await UserModel.findOneAndUpdate(
                            { _id: existingUser._id },
                            { $set: updatedUser },
                            { new: true }
                        );
                        return cb(null, existingUser);
                    } else {
                        // Create a new user:
                        const newUser = new UserModel({
                            googleId: profile.id,
                            username: profile.displayName,
                            email: profile.emails[0].value,
                            pic: profile.photos[0].value,
                            secret: accessToken
                        });
                        await newUser.save();
                        return cb(null, newUser);
                    }
                } catch (err) {
                    console.error(err);
                    return cb(err);
                }
            }
        )
    );
}

module.exports = configureGoogleAuthentication;