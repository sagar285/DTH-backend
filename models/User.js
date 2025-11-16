const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
          name: { type: String, required: true },

          email: { type: String, required: true, unique: true },

          otp: { type: String },
          otpExpires: { type: Date },

          password: { type: String },

          profileImage: { type: String, default: null }, // <-- Added for upload

          isVerified: { type: Boolean, default: false },

          role: {
                    type: String,
                    enum: [process.env.ROLE_USER, process.env.ROLE_VENDOR, process.env.ROLE_ADMIN],
                    default: process.env.ROLE_USER        // default normal user
          },


},
          {
                    timestamps: true // <-- auto adds createdAt, updatedAt
          });

module.exports = mongoose.model("User", userSchema);
