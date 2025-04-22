// routes/transactionRoutes.js
const express = require("express");
const router = express.Router();
const {
  purchaseVoucher,
  redeemVoucher,
} = require("../controllers/transactionController");

const { protect } = require("../middlewares/auth");

// Purchase a voucher
router.post("/purchase", protect, purchaseVoucher);

// Redeem a voucher
router.post("/redeem", protect, redeemVoucher);

module.exports = router;
