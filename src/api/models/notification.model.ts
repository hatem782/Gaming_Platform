export { };

const mongoose = require('mongoose');


const notificationModel = new mongoose.Schema({
  text: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  seen:{
    type : Boolean ,
    default : false
  }

},
  {
    timestamps: true
  });

module.exports = mongoose.model('notification', notificationModel);
