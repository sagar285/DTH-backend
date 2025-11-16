const express = require("express");
const router = express.Router();

const {
          registerUser,
          verifyOtp,
          setPassword,
          login,
} = require("../controller/authController");

router.post("/register", registerUser);
router.post("/verify-otp", verifyOtp);
router.post("/set", setPassword);
router.post("/login", login);

module.exports = router;
