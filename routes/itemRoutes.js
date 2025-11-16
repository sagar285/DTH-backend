const express = require("express");
const upload = require("../middleware/upload");
const router = express.Router();
const { Vendor_protect } = require("../middleware/authMiddleware");
const {
          createItem,
          getItemsByCategory,
          updateItem,
          deleteItem
} = require("../controller/itemController");



router.post("/add", Vendor_protect,upload.single("image"), createItem);                 // Create
router.get("/:categoryId", Vendor_protect, getItemsByCategory);  // Read
router.put("/edit/:id", Vendor_protect, updateItem);             // Update
router.delete("/delete/:id", Vendor_protect, deleteItem);        // Delete

module.exports = router;
