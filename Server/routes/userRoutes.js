const express = require("express");
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  deleteProfile,
  updateProfile,
  protect,
} = require("../controllers/authController");

const { uploadUserPhoto, resizeUserPhoto } = require("../models/userModel");

const router = express.Router();

// Define signup and login routes
router.post("/signup", signup);
router.post("/login", login);

router.post("/forgotpassword", forgotPassword);
router.patch("/resetpassword/:token", resetPassword);
router.patch("/updatepassword", protect, updatePassword);
router.delete("/deleteProfile", protect, deleteProfile);
router.patch(
  "/updateprofile",
  protect,
  uploadUserPhoto,
  resizeUserPhoto,
  updateProfile
);

module.exports = router;
