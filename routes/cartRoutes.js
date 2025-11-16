const express = require("express");
const router = express.Router();
const {
          addToCart,
          getCart,
          updateQuantity,
          removeItem,
          clearCart,
} = require("../controller/cartController");
// USER SIDE (No vendor protect)

router.post("/add", addToCart);
router.get("/get", getCart);
router.post("/update-qty", updateQuantity);
router.post("/remove", removeItem);
router.post("/clear", clearCart);

module.exports = router;
