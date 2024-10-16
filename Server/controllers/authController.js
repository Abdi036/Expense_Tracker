const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/email");
const { promisify } = require("util");

const multer = require("multer");

// Set storage for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Where to store the file
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1]; // Get file extension
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`); // Generate unique filename
  },
});

// Multer upload configuration
const upload = multer({ storage: storage });

// Middleware to handle file uploads
exports.uploadUserPhoto = upload.single("photo"); // 'photo' is the field name in your form

// Resize the photo before saving it to disk
exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next(); // If no file is uploaded, move to next middleware

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  // Use Sharp to resize and compress the image
  await sharp(req.file.buffer) // Access the image buffer stored in memory
    .resize(500, 500) // Resize to 500x500 pixels
    .toFormat("jpeg") // Convert to JPEG format
    .jpeg({ quality: 90 }) // Compress the image with 90% quality
    .toFile(`uploads/${req.file.filename}`); // Save the resized image to disk

  next(); // Call the next middleware (updateProfile) after resizing is done
});

// Token generation function
function generateToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

exports.signup = catchAsync(async (req, res, next) => {
  // Create new user
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  });

  // Generate token for the user
  const token = generateToken(newUser._id);

  // Send response with user data and token
  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if both password and email exist
  if (!email || !password) {
    return next(new AppError("All fields are required", 400));
  }

  // Check if user exists and password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Invalid email or password", 401));
  }

  // Generate token if everything is okay
  const token = generateToken(user._id);

  // Send token to the client
  res.status(200).json({
    status: "success",
    token,
  });
});

// //////Protect Middleware
exports.protect = catchAsync(async (req, res, next) => {
  // 1. Get the token from headers
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]; // Get token after 'Bearer'
  }

  // 2. If token doesn't exist, throw an error
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 3. Verify the token
  let decoded;
  try {
    decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new AppError("Invalid token. Please log in again.", 401));
  }

  // 4. Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError("The user belonging to this token no longer exists.", 401)
    );
  }

  // 5. Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // 6. Attach user to request
  req.user = currentUser;
  next();
});

// forgotPassword
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("User not found!", 404));
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://localhost:5173/resetPassword/${resetToken}`;

  const textMessage = `If you forgot your password, click the link below to reset it: ${resetURL}.\nIf you didn't request this, please ignore this email.`;

  const htmlMessage = `
        <p>If you forgot your password, click the link below to reset it:</p>
        <a href="${resetURL}">Reset Password</a>
        <p>If you didn't request this, please ignore this email.</p>
      `;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 minutes)",
      text: textMessage,
      html: htmlMessage,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  // Hash the token from the request params
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  // Find the user with the hashed token and check if the token is still valid
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }, // Check if the token is still valid
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  // Check if the passwords match
  if (req.body.password !== req.body.confirmPassword) {
    return next(new AppError("Passwords do not match", 400));
  }

  // Update the user's password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined; // Clear the reset token
  user.passwordResetExpires = undefined; // Clear the expiration time
  await user.save();

  // Generate a new token for the user
  const token = generateToken(user._id);

  res.status(200).json({
    status: "success",
    token,
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  if (
    !req.body.currentPassword ||
    !req.body.newPassword ||
    !req.body.confirmNewPassword
  ) {
    return next(new AppError("All fields are required", 400));
  }

  const user = await User.findById(req.user.id).select("+password");

  if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError("Current password is incorrect", 401));
  }

  if (req.body.newPassword !== req.body.confirmNewPassword) {
    return next(new AppError("Passwords do not match", 400));
  }

  user.password = req.body.newPassword; // Update to new password
  user.confirmPassword = req.body.confirmNewPassword; // Update to new confirm password
  await user.save(); // Save updated user

  const token = generateToken(user._id); // Generate new token

  res.status(200).json({
    status: "success",
    token,
  });
});

exports.updateProfile = catchAsync(async (req, res, next) => {
  // 1. Ensure that password updates are not done via this route
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError(
        "This route is not for updating password, please use /updatePassword.",
        400
      )
    );
  }

  // 2. Create an empty object to store fields to update
  const updatedFields = {};

  // 3. Update user name and email if they are provided in the request body
  if (req.body.name) updatedFields.name = req.body.name;
  if (req.body.email) updatedFields.email = req.body.email;

  // 4. If a photo was uploaded and resized, update the 'photo' field
  if (req.file) updatedFields.photo = req.file.filename;

  // 5. Check if there are actually fields to update
  if (Object.keys(updatedFields).length === 0) {
    return next(new AppError("No fields to update", 400));
  }

  // 6. Update the user's profile with the provided fields
  const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedFields, {
    new: true, // Return the updated document
    runValidators: true, // Ensure validation is applied during update
  });

  // 7. Generate a new token if necessary (for example, if email was changed)
  const token = generateToken(updatedUser._id); // You can opt not to generate a token if unnecessary

  // 8. Send the updated user data in the response
  res.status(200).json({
    status: "success",
    token, // Return new token if generated
    data: {
      user: updatedUser,
    },
  });
});
