const express =require("express")
const upload = require("../middleware/upload");
const router = express.Router();
const { Vendor_protect } = require("../middleware/authMiddleware");
const {
          createCategory,
          getCategories,
          updateCategory,
          deleteCategory
} = require("../controller/categoryController");



router.post("/add", Vendor_protect, upload.single("icon"), createCategory);          // Create
router.get("/:shopId", Vendor_protect, getCategories);        // Read
router.put("/edit/:id", Vendor_protect,upload.single("icon"), updateCategory);      // Update
router.delete("/delete/:id", Vendor_protect, deleteCategory); // Delete

module.exports = router;
