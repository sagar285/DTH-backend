const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
// ------------------------------
// PUT /api/user/upload-image
// ------------------------------
exports.uploadImage = async (req, res) => {
          try {
                    if (!req.file) {
                              return res.status(400).json({ message: "No image file uploaded" });
                    }

                    const user = await User.findById(req.user.id);
                    if (!user) return res.status(404).json({ message: "User not found" });

                    const oldImage = user.profileImage;
                    user.profileImage = req.file.filename; // store filename
                    await user.save();

                    res.json({
                              message: "Profile image updated successfully",
                              oldImage,
                              newImage: user.profileImage
                    });
          } catch (error) {
                    console.error("Upload Error:", error);
                    res.status(500).json({ message: "Error uploading image" });
          }
};

// ------------------------------
// PUT /api/user/update-name
// ------------------------------
exports.updateName = async (req, res) => {
          try {
                    const { name, role } = req.body;
                    if (!name) return res.status(400).json({ message: "Name is required" });

                    const user = await User.findById(req.user.id);
                    if (!user) return res.status(404).json({ message: "User not found" });

                    const oldName = user.name;
                    user.role = role;
                    user.name = name;
                    await user.save();

                    res.json({
                              message: "Name updated successfully",
                              oldName,
                              newName: user.name
                    });
          } catch (error) {
                    console.error("Update Name Error:", error);
                    res.status(500).json({ message: "Error updating name" });
          }
};

// ================================
// 3. CHANGE PASSWORD USING OLD PASSWORD
// ================================
exports.changePassword = async (req, res) => {
          try {
                    const userId = req.user._id;  // from protect middleware
                    const { oldPassword, newPassword } = req.body;

                    console.log(req.user, "rrr")

                    if (!oldPassword || !newPassword) {
                              return res.status(400).json({ message: "Both passwords are required" });
                    }

                    const user = await User.findById(req.user.id);
                    if (!user) return res.status(404).json({ message: "User not found" });

                    // Compare old password
                    const isMatch = await bcrypt.compare(oldPassword, user.password);
                    if (!isMatch)
                              return res.status(400).json({ message: "Old password is incorrect" });

                    // Hash new password
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(newPassword, salt);

                    await user.save();

                    res.json({ message: "Password changed successfully" });

          } catch (err) {
                    console.error(err);
                    res.status(500).json({ message: "Server error" });
          }
};


// ================================
// 4. SEND OTP FOR PASSWORD RESET
// ================================
exports.sendResetOtp = async (req, res) => {
          try {
                    const { email } = req.body;
                    if (!email) return res.status(400).json({ message: "Email required" });

                    const user = await User.findOne({ email });
                    if (!user)
                              return res.status(404).json({ message: "No user with this email" });

                    // Generate OTP
                    const otp = Math.floor(100000 + Math.random() * 900000).toString();

                    user.otp = otp;
                    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 min
                    await user.save();

                    // Send OTP email
                    await sendEmail(
                              email,
                              "Password Reset OTP",
                              `Your OTP is: ${otp}`
                    );

                    res.json({ message: "OTP sent to email" });

          } catch (error) {
                    console.log(error);
                    res.status(500).json({ message: "Error sending OTP" });
          }
};


// ================================
// 5. RESET PASSWORD USING OTP
// ================================
exports.resetPassword = async (req, res) => {
          try {
                    const { email, otp, newPassword } = req.body;

                    if (!email || !otp || !newPassword) {
                              return res.status(400).json({ message: "All fields required" });
                    }

                    const user = await User.findOne({ email });

                    if (!user) return res.status(404).json({ message: "User not found" });

                    if (user.otp !== otp)
                              return res.status(400).json({ message: "Invalid OTP" });

                    if (user.otpExpires < Date.now())
                              return res.status(400).json({ message: "OTP expired" });

                    // Hash new password
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(newPassword, salt);

                    // Clear OTP
                    user.otp = undefined;
                    user.otpExpires = undefined;

                    await user.save();

                    res.json({ message: "Password reset successful" });

          } catch (error) {
                    console.log(error);
                    res.status(500).json({ message: "Server error" });
          }
};