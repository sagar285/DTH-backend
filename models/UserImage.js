const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
          imageId: { type: String, required: true },
          imageUrl: { type: String, required: true },
          createdAt: { type: Date, default: Date.now },
          updatedAt: { type: Date, default: Date.now }
});

const userImageSchema = new mongoose.Schema({
          user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    unique: true  // ⭐ One document per user
          },
          images: [imageSchema]
}, { timestamps: true });

module.exports = mongoose.model("UserImage", userImageSchema);
