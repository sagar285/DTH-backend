const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const {
          uploadImage,
          updateName,
          changePassword,
          sendResetOtp,
          resetPassword,
} = require("../controller/userController");

router.get("/profile", protect, (req, res) => {
          res.json({
                    message: "Welcome to your profile",
                    user: req.user, // this comes from JWT
          });
});
router.put("/upload-image", protect, upload.single("image"), uploadImage);

// Update user name
router.put("/update-name", protect, updateName);

// Change password using old password
router.put("/change-password", protect, changePassword);

// Send OTP for password reset
router.post("/send-reset-otp", sendResetOtp);

// Reset password using OTP
router.post("/reset-password", resetPassword);


module.exports = router;
