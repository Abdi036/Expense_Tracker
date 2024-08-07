const mongoose = require("mongoose");
const validator = require("validator");

// Define the user schema with validations
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must have a name"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "User must have an email"],
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "User must have a password"],
    minlength: [8, "Password must be at least 8 characters long"],
  },
});

// Create the User model using the user schema
const User = mongoose.model("User", userSchema);

module.exports = User;
