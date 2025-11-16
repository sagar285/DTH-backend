// controller/shopController.js

const Shop = require("../models/shopModel");
const { v4: uuidv4 } = require("uuid");
const generateQR = require("../utils/generateQR");

// Create Shop
exports.createShop = async (req, res) => {
          try {
                    const { shopName, phone, shopAddress } = req.body;

                    let logoPath = "";
                    let imageArray = [];

                    console.log(req.body, "uuuuuuuu")

                    if (req.files && req.files.shopLogo) {
                              logoPath = req.files.shopLogo[0].path;
                    }

                    if (req.files && req.files.shopImages) {
                              imageArray = req.files.shopImages.map((file) => ({
                                        imageId: uuidv4(),
                                        imageUrl: file.path,
                              }));
                    }

                    const shop = await Shop.create({
                              user: req.user.id,
                              shopName,
                              phone,
                              shopAddress,
                              shopLogo: logoPath,
                              shopImages: imageArray
                    });

                    res.json({
                              message: "Shop created successfully",
                              shop,
                    });

          } catch (error) {
                    res.status(500).json({ message: error.message });
          }
};

// Update Shop
exports.updateShop = async (req, res) => {
          try {
                    const shop = await Shop.findOne({ user: req.user.id });
                    if (!shop) return res.status(404).json({ message: "Shop not found" });

                    const { shopName, phone, shopAddress } = req.body;

                    if (shopName) shop.shopName = shopName;
                    if (phone) shop.phone = phone;
                    if (shopAddress) shop.shopAddress = shopAddress;

                    await shop.save();

                    res.json({ message: "Shop updated successfully", shop });

          } catch (error) {
                    res.status(500).json({ message: error.message });
          }
};

// Add More Images
exports.addShopImages = async (req, res) => {
          try {
                    const shop = await Shop.findOne({ user: req.user.id });
                    if (!shop) return res.status(404).json({ message: "Shop not found" });

                    if (!req.files || req.files.length === 0)
                              return res.status(400).json({ message: "No images uploaded" });

                    req.files.forEach((file) => {
                              shop.shopImages.push({
                                        imageId: uuidv4(),
                                        imageUrl: file.path,
                              });
                    });

                    await shop.save();

                    res.json({
                              message: "Images added successfully",
                              images: shop.shopImages,
                    });

          } catch (error) {
                    res.status(500).json({ message: error.message });
          }
};

// Delete a Single Image
exports.deleteShopImage = async (req, res) => {
          try {
                    const shop = await Shop.findOne({ user: req.user.id });
                    if (!shop) return res.status(404).json({ message: "Shop not found" });

                    const { imageId } = req.params;

                    shop.shopImages = shop.shopImages.filter(
                              (img) => img.imageId !== imageId
                    );

                    await shop.save();

                    res.json({
                              message: "Shop image deleted successfully",
                              images: shop.shopImages
                    });

          } catch (error) {
                    res.status(500).json({ message: error.message });
          }
};
exports.createShopQR = async (req, res) => {
    try {
        const { shopId } = req.params;

        const qrImage = await generateQR(shopId);

        res.json({
            success: true,
            shopId,
            qrImage
        });

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};