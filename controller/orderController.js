

const Counter = require("../models/Counter");
const Item = require("../models/Item");
const Order = require("../models/Orders");

// AUTO INCREMENT FUNCTION
async function getNextOrderNumber() {
          const counter = await Counter.findOneAndUpdate(
                    { name: "orders" },
                    { $inc: { seq: 1 } },
                    { new: true, upsert: true }
          );

          return counter.seq;
}

// ============================
//  PLACE ORDER (User + Guest)
// ============================
exports.placeOrder = async (req, res) => {
          try {
                    const { shopId, userId, items, guestDetails } = req.body;

                    if (!items || items.length === 0) {
                              return res.status(400).json({ success: false, message: "No items added" });
                    }

                    // Calculate final total
                    let grandTotal = 0;
                    for (const it of items) {
                              grandTotal += it.quantity * it.price;
                    }

                    // Get new order number
                    const orderNumber = await getNextOrderNumber();

                    const order = new Order({
                              shopId,
                              userId: userId || null,
                              isGuest: userId ? false : true,
                              guestDetails: userId ? null : guestDetails,
                              items,
                              grandTotal,
                              orderNumber,
                    });

                    await order.save();

                    return res.status(201).json({
                              success: true,
                              message: "Order placed successfully",
                              order
                    });
          } catch (err) {
                    console.log("Place order error:", err);
                    return res.status(500).json({ success: false, message: "Server error" });
          }
};


// ============================
// USER ORDERS
// ============================
exports.getUserOrders = async (req, res) => {
          try {
                    const { userId } = req.params;

                    const orders = await Order.find({ userId }).sort({ createdAt: -1 });

                    return res.status(200).json({ success: true, orders });
          } catch (err) {
                    console.log("User order error:", err);
                    return res.status(500).json({ success: false, message: "Server error" });
          }
};


// ============================
// GET ORDER BY ID
// ============================
exports.getOrderById = async (req, res) => {
          try {
                    const order = await Order.findById(req.params.id);

                    if (!order)
                              return res.status(404).json({ success: false, message: "Order not found" });

                    return res.status(200).json({ success: true, order });
          } catch (err) {
                    console.log("Get order error:", err);
                    return res.status(500).json({ success: false, message: "Server error" });
          }
};
