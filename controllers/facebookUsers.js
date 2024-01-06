const facebookStrategy = require('passport-facebook');
const UserModel = require('../models/facebookUsers');
require('dotenv').config;

async function configureFacebookAuthentication(passport) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        UserModel.findById(id, function (err, user) {
            done(err, user);
        });
    });

    passport.use(
        new facebookStrategy(
            {
                clientID: process.env.FACEBOOK_CLIENT_ID,
                clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
                callbackURL: "http://localhost:5000/auth/facebook/callback",
            },
            async (accessToken, refreshToken, profile, cb) => {
                try {
                    console.log(profile);
                    const existingUser = await UserModel.findOne({ facebookId: profile.id });

                    if (existingUser) {
                        // Update existing user information:
                        const updatedUser = {
                            fullname: profile.displayName,
                            email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '',
                            pic: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '',
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
                            facebookId: profile.id,
                            username: profile.displayName,
                            email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '',
                            pic: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : '',
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

module.exports = configureFacebookAuthentication;