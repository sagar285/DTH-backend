const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
          {
                    orderNumber: { type: Number, required: true }, // Auto Increment

                    shopId: {
                              type: mongoose.Schema.Types.ObjectId,
                              ref: "Shop",
                              required: true
                    },

                    userId: {
                              type: mongoose.Schema.Types.ObjectId,
                              ref: "User",
                              default: null, // Null for guest
                    },

                    isGuest: {
                              type: Boolean,
                              default: false
                    },

                    guestDetails: {
                              name: { type: String },
                              mobile: { type: String },
                              address: { type: String },
                    },

                    items: [
                              {
                                        itemId: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
                                        name: String,
                                        quantity: Number,
                                        price: Number,
                                        total: Number
                              }
                    ],

                    grandTotal: { type: Number, required: true },

                    status: {
                              type: String,
                              enum: ["pending", "confirmed", "out_for_delivery", "completed", "cancelled"],
                              default: "pending",
                    }
          },
          { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
