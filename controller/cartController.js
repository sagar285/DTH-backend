const Cart = require("../models/Cart");
const Item = require("../models/Item");

// Function to recalculate total
function calculateTotals(cart) {
  let sum = 0;
  cart.items.forEach(i => {
    i.total = i.price * i.quantity;
    sum += i.total;
  });
  cart.grandTotal = sum;
}


// ==========================
// ADD ITEM TO CART
// ==========================
exports.addToCart = async (req, res) => {
  try {
    const { userId, guestId, shopId, itemId, quantity = 1 } = req.body;

    if (!shopId || !itemId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Fetch item data
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    // Find existing cart
    const cart = await Cart.findOne({
      shopId,
      $or: [{ userId: userId || null }, { guestId: guestId || null }]
    });

    let currentCart = cart;

    // If no cart → create one
    if (!currentCart) {
      currentCart = new Cart({
        shopId,
        userId: userId || null,
        guestId: guestId || null,
        items: []
      });
    }

    // Check if item already exists in cart
    const existingItem = currentCart.items.find(i => i.itemId.toString() === itemId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      currentCart.items.push({
        itemId,
        name: item.name,
        price: item.price,
        quantity,
        total: item.price * quantity
      });
    }

    calculateTotals(currentCart);
    await currentCart.save();

    return res.status(200).json({
      success: true,
      message: "Item added to cart",
      cart: currentCart
    });

  } catch (err) {
    console.log("Add to cart error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// ==========================
// GET CART
// ==========================
exports.getCart = async (req, res) => {
  try {
    const { userId, guestId, shopId } = req.query;

    const cart = await Cart.findOne({
      shopId,
      $or: [{ userId: userId || null }, { guestId: guestId || null }]
    });

    return res.status(200).json({
      success: true,
      cart: cart || { items: [], grandTotal: 0 }
    });

  } catch (err) {
    console.log("Get cart error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// ==========================
// UPDATE QUANTITY
// ==========================
exports.updateQuantity = async (req, res) => {
  try {
    const { cartId, itemId, quantity } = req.body;

    const cart = await Cart.findById(cartId);
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const item = cart.items.find(i => i.itemId.toString() === itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found in cart" });

    item.quantity = quantity;
    item.total = item.price * quantity;

    calculateTotals(cart);
    await cart.save();

    return res.status(200).json({ success: true, message: "Quantity updated", cart });

  } catch (err) {
    console.log("Update qty error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// ==========================
// REMOVE ITEM FROM CART
// ==========================
exports.removeItem = async (req, res) => {
  try {
    const { cartId, itemId } = req.body;

    const cart = await Cart.findById(cartId);
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter(i => i.itemId.toString() !== itemId);

    calculateTotals(cart);
    await cart.save();

    return res.status(200).json({ success: true, message: "Item removed", cart });

  } catch (err) {
    console.log("Remove error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};


// ==========================
// CLEAR CART
// ==========================
exports.clearCart = async (req, res) => {
  try {
    const { cartId } = req.body;

    const cart = await Cart.findById(cartId);
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = [];
    cart.grandTotal = 0;

    await cart.save();

    return res.status(200).json({ success: true, message: "Cart cleared", cart });

  } catch (err) {
    console.log("Clear error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
