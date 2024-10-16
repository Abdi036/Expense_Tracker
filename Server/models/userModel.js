const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

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
  photo: {
    type: String,
    default: "Unknown_person.jpg",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
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

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  // Hash the token and set it to the passwordResetToken field
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Add this method to your user schema
userSchema.methods.changedPasswordAfter = function (JWTiat) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTiat < changedTimestamp; // return true if password was changed after token was issued
  }

  // If there is no password changed timestamp, the password has not changed
  return false;
};

// Create the User model using the user schema
const User = mongoose.model("User", userSchema);

module.exports = User;
