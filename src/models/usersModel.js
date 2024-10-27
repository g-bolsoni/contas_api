const mongoose = require('mongoose');

const User = mongoose.model("User", {
  name: String,
  email: String,
  password: String,
  resettoken: { type: String, required: false },
  resettokenExpiration: { type: Date, required: false }
});

module.exports = User;