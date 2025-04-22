// models/Voucher.js
const mongoose = require("mongoose");

const VoucherSchema = new mongoose.Schema({
  name: String,
  code: {
    type: String,
    unique: true,
    default: function () {
      // Generate a random 8-character alphanumeric code
      return Math.random().toString(36).substring(2, 10).toUpperCase();
    },
  },
  value: Number,
  status: {
    type: String,
    enum: ["active", "redeemed", "expired"],
    default: "active",
  },
  expiryDate: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to check and update expired vouchers before querying
VoucherSchema.pre("find", function () {
  this.where({ expiryDate: { $gt: Date.now() }, status: "active" });
});

// Static method to check and mark expired vouchers
VoucherSchema.statics.checkExpiredVouchers = async function () {
  const now = new Date();
  await this.updateMany(
    { expiryDate: { $lt: now }, status: "active" },
    { $set: { status: "expired" } }
  );
};

module.exports = mongoose.model("Voucher", VoucherSchema);
