// Blueprint for a User account. Notice how much simpler this is than
// the Expense model - just what's needed to identify and authenticate someone.

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // MongoDB will reject a second user trying to register with the same email
      lowercase: true, // automatically stores "John@Email.com" as "john@email.com"
      trim: true,
    },
    password: {
      type: String,
      required: true,
      // NOTE: we deliberately do NOT store the real password here.
      // By the time this gets saved, it will already be scrambled (hashed)
      // by bcrypt in the controller - see authController.js
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);