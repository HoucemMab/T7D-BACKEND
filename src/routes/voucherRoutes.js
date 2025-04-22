const express = require("express");
const router = express.Router();
const {
  createVoucher,
  updateVoucher,
  redeemVoucher,
} = require("../controllers/voucherController");

// Middleware (example placeholders)
const { protect, authorize: adminOnly } = require("../middlewares/auth");

// Create a voucher (Admin only)
router.post("/", createVoucher);

// Update a voucher (Admin only)
router.put("/:id", protect, adminOnly, updateVoucher);

// Redeem a voucher (Authenticated user)
router.post("/redeem", protect, redeemVoucher);

module.exports = router;
