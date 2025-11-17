const dotenv = require("dotenv");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Configure mail
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded ✅" : "❌ Not Loaded");

const transporter = nodemailer.createTransport({
           service: "gmail",
          port: 587,
          secure: false,
          requireTLS: true,
          auth: {
            user: "gtest3681@gmail.com",
            pass: "jbiwkldgooalvtgj",
          },

});

// ✅ 1. Register user & send OTP
exports.registerUser = async (req, res) => {
          try {
                    const { name, email, role } = req.body;
                    const otp = Math.floor(100000 + Math.random() * 900000).toString();
                    const otpExpires = Date.now() + 5 * 60 * 1000; // 5 min

                    let user = await User.findOne({ email });
                    if (user && user.isVerified) {
                              return res.status(400).json({ message: "User already registered" });
                    }

                    if (!user) {
                              user = new User({ name, email, otp, otpExpires });
                    } else {
                              user.otp = otp;
                              user.otpExpires = otpExpires;
                    }

                    await user.save();

                    await transporter.sendMail({
                              from: "gtest3681@gmail.com",
                              to: email,
                              subject: "Your OTP Verification Code",
                              text: `Your OTP is ${otp}. It will expire in 5 minutes.`
                    });

                    res.json({ message: "OTP sent to your email" });
          } catch (error) {
                    console.error(error);
                    res.status(500).json({ message: "Server error" });
          }
};

// ✅ 2. Verify OTP and issue temporary token
exports.verifyOtp = async (req, res) => {
          try {
                    const { email, otp } = req.body;

                    const user = await User.findOne({ email });
                    if (!user) return res.status(400).json({ message: "User not found" });
                    if (user.otp !== otp) return res.status(400).json({ message: "Invalid OTP" });
                    if (Date.now() > user.otpExpires) return res.status(400).json({ message: "OTP expired" });

                    user.isVerified = true;
                    user.otp = undefined;
                    user.otpExpires = undefined;
                    await user.save();

                    const tempToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "10m" });

                    res.json({ message: "OTP verified", tempToken });
          } catch (error) {
                    res.status(500).json({ message: "Server error" });
          }
};

// ✅ 3. Set password using temporary token
exports.setPassword = async (req, res) => {
          try {
                    const { password } = req.body;
                    const token = req.headers.authorization?.split(" ")[1];

                    if (!token) return res.status(401).json({ message: "Token required" });

                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    const user = await User.findOne({ email: decoded.email });
                    if (!user) return res.status(404).json({ message: "User not found" });

                    const hashedPassword = await bcrypt.hash(password, 10);
                    user.password = hashedPassword;
                    await user.save();

                    const permanentToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

                    res.json({ message: "Password set successfully", token: permanentToken });
          } catch (error) {
                    res.status(500).json({ message: "Invalid or expired token" });
          }
};
exports.login = async (req, res) => {
          try {
                    const { email, password } = req.body;

                    // Validate input
                    if (!email || !password) {
                              return res.status(400).json({ message: "Email and password are required" });
                    }

                    // Find user
                    const user = await User.findOne({ email });
                    if (!user) {
                              return res.status(404).json({ message: "User not found" });
                    }

                    // Check password
                    const isMatch = await bcrypt.compare(password, user.password);
                    if (!isMatch) {
                              return res.status(401).json({ message: "Invalid password" });
                    }

                    // Generate JWT token
                    const token = jwt.sign(
                              { id: user._id, email: user.email },
                              process.env.JWT_SECRET,
                              { expiresIn: "7d" }
                    );

                    res.json({
                              message: "Login successful",
                              token,
                              user: {
                                        name: user.name,
                                        email: user.email,
                              },
                    });
          } catch (error) {
                    console.error("Login Error:", error);
                    res.status(500).json({ message: "Server error during login" });
          }
};
