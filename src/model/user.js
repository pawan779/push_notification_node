const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
    required: false,
    unique: false,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },

  isAdmin: {
    type: Boolean,
    default: false,
  },
});

let User = mongoose.model("User", UserSchema);
module.exports = User;
