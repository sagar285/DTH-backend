const express = require("express");
const router = express.Router();

const { Vendor_protect } = require("../middleware/authMiddleware");

const uploadShopImages = require("../middleware/shopUpload");

const {
          createShop,
          updateShop,
          addShopImages,
          deleteShopImage,
          createShopQR
} = require("../controller/shopController");

// Create Shop with logo + images
router.post(
          "/create",
          Vendor_protect,
          uploadShopImages.fields([
                    { name: "shopLogo", maxCount: 1 },
                    { name: "shopImages", maxCount: 10 }
          ]),
          createShop
);

// Update shop info
router.put("/update", Vendor_protect, updateShop);

// Add more images
router.post(
          "/add-images",
          Vendor_protect,
          uploadShopImages.array("shopImages", 10),
          addShopImages
);

// Delete image
router.delete("/delete-image/:imageId", Vendor_protect, deleteShopImage);
router.get("/qr/:shopId", createShopQR);

module.exports = router;
