const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
    select: false, // Do not return password in query results
  },
  confirmPassword: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords do not match",
    },
  },
  photo: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  passwordChangedAt: Date,
});

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  // Only run if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with a salt of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Remove confirmPassword field, it's not needed in the DB
  this.confirmPassword = undefined;
  next();
});

// Password checking method
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Create the User model using the user schema
const User = mongoose.model("User", userSchema);

module.exports = User;
