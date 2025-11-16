// models/Item.js
const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
          shopId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Shop",
                    required: true
          },
          categoryId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Category",
                    required: true
          },
          name: { type: String, required: true },
          description: { type: String },

          type: {
                    type: String,
                    enum: ["veg", "nonveg"],
                    required: true
          },

          price: { type: Number, required: true },
          offerPrice: { type: Number },

          quantityOptions: [
                    {
                              label: String,  // "Half", "Full", "250g", etc.
                              price: Number   // optional price override
                    }
          ],

          image: { type: String },     // optional image URL
          isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports=mongoose.model("Item", itemSchema);
