const mongoose = require("mongoose");

const googleUserSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    pic: String,
    googleId: String,
    secret: String,
});

module.exports = mongoose.model("googleUsers", googleUserSchema);