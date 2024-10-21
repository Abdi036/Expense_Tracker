const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");

const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User must have a name"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "User must have an email"],
    lowercase: true,  
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "User must have a password"],
    minlength: [8, "Password must be at least 8 characters long"],
    select: false,
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
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

// Update passwordChangedAt if password is modified
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Set up multer storage and file filter
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

userSchema.statics.uploadUserPhoto = upload.single("photo");

// Middleware to handle image processing
userSchema.statics.resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next();

  // Ensure the directory exists
  const userDir = path.join(__dirname, "../userImage");
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`${userDir}/${req.file.filename}`);

  req.body.photo = req.file.filename;

  next();
};

// Modify the user schema to save the photo
userSchema.pre("save", function (next) {
  if (!this.isModified("photo") && !this.isNew) return next();

  this.photo = this.photo || "Unknown_person.jpg";
  next();
});

// Check if password is correct
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Generate password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Check if password was changed after JWT was issued
userSchema.methods.changedPasswordAfter = function (JWTiat) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTiat < changedTimestamp;
  }
  return false;
};

// Virtual populate for user's products
userSchema.virtual("products", {
  ref: "Product",
  foreignField: "user",
  localField: "_id",
});

const User = mongoose.model("User", userSchema);
module.exports = User;
