// models/Category.js
const mongoose =require("mongoose")

const categorySchema = new mongoose.Schema({
          shopId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Shop",
                    required: true
          },
          name: { type: String, required: true },
          icon: { type: String }, // optional (URL)
          isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);
