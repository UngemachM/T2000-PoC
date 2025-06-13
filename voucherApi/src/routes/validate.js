const express = require("express");
const path = require("path");

const { loadCoupons, findCouponConfig } = require("../logic/eligibilityCodeCommon");
const { isProductEligibleForCoupon } = require("../logic/eligibilityCodeForProdukt");
const { isCartEligibleForCoupon } = require("../logic/eligibilityCodeForCart");


const router = express.Router();
const CSV_PATH = path.join(__dirname, "../data/vouchers.csv");

router.post("/codeForProduct", (req, res) => {
  const { product, code } = req.body;

  if (!product || !code) {
    return res.status(400).json({ error: "product and code are required" });
  }

  try {
    const coupons = loadCoupons(CSV_PATH);
    const config = findCouponConfig(coupons, code);

    if (!config) {
      console.log("❌Invalid voucher code: "+ code)
      return res.status(404).json({ valid: false, error: "Invalid voucher code" });
    }

    const valid = isProductEligibleForCoupon(product, config);
    return res.json({ valid, code });
  } catch (err) {
    console.error("❌Validation error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/codeForCart", (req, res) => {
  const { cart, code } = req.body;

  if (!cart || !code) {
    return res.status(400).json({ error: "Cart and code are required" });
  }

  try {
    const coupons = loadCoupons(CSV_PATH);
    const config = findCouponConfig(coupons, code);

    if (!config) {
       console.log("❌Invalid voucher code: "+ code)
      return res.status(404).json({ valid: false, error: "Invalid voucher code" });
    }

    const valid = isCartEligibleForCoupon(cart, config);
    return res.json({ valid, code });
  } catch (err) {
    console.error("❌Validation error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
