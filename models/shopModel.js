const mongoose = require("mongoose");

const shopImageSchema = new mongoose.Schema({
          imageId: { type: String, required: true },
          imageUrl: { type: String, required: true },
          createdAt: { type: Date, default: Date.now },
});

const shopSchema = new mongoose.Schema(
          {
                    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

                    shopName: { type: String, required: true },
                    phone: { type: String, required: true },
                    shopAddress: { type: String, required: true },

                    shopLogo: { type: String, default: "" }, // single image

                    shopImages: [shopImageSchema], // array of images
          },
          { timestamps: true }
);

module.exports = mongoose.model("Shop", shopSchema);
