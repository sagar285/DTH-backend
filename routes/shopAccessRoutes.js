const express = require("express");
const router = express.Router();
const { getShopMenu } = require("../controller/shopAccessController");

router.get("/shop/:shopId", getShopMenu);

module.exports = router;
