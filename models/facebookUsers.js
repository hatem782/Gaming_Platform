const mongoose = require("mongoose");

const facebookUserSchema = new mongoose.Schema({
    fullname: String,
    pic: String,
    facebookId: String,
    secret: String,
});

module.exports = mongoose.model("facebookUsers", facebookUserSchema);