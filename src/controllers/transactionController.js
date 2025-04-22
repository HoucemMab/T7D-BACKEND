// controllers/transactionController.js
const Transaction = require("../models/Transaction");
const Voucher = require("../models/Voucher");
const User = require("../models/User");
const {
  purchaseSchema,
  redeemSchema,
  historySchema,
} = require("../validations/transactionValidations");
const { validate } = require("../middlewares/validate");

// @desc    Purchase a voucher
// @route   POST /api/vouchers/purchase
// @access  User
exports.purchaseVoucher = [
  validate(purchaseSchema),
  async (req, res, next) => {
    try {
      const { voucherId } = req.body;
      const userId = req.user.id;

      // Get voucher and user
      const voucher = await Voucher.findById(voucherId);
      const user = await User.findById(userId);

      if (!voucher) {
        return res.status(404).json({
          success: false,
          error: "Voucher not found",
        });
      }

      if (voucher.status !== "active") {
        return res.status(400).json({
          success: false,
          error: "Voucher is not available for purchase",
        });
      }

      if (user.balance < voucher.value) {
        return res.status(400).json({
          success: false,
          error: "Insufficient balance",
        });
      }

      // Deduct from user balance
      user.balance -= voucher.value;
      await user.save();

      // Create transaction record
      const transaction = await Transaction.create({
        user: userId,
        voucher: voucherId,
        type: "purchase",
        amount: voucher.value,
      });

      res.status(201).json({
        success: true,
        data: transaction,
      });
    } catch (err) {
      next(err);
    }
  },
];

// @desc    Redeem a voucher
// @route   POST /api/vouchers/redeem
// @access  User
exports.redeemVoucher = [
  validate(redeemSchema),
  async (req, res, next) => {
    try {
      const { voucherCode } = req.body;
      const userId = req.user.id;

      // Find voucher by code
      const voucher = await Voucher.findOne({ code: voucherCode });

      if (!voucher) {
        return res.status(404).json({
          success: false,
          error: "Voucher not found",
        });
      }

      if (voucher.status !== "active") {
        return res.status(400).json({
          success: false,
          error: "Voucher is not redeemable",
        });
      }

      if (voucher.expiryDate < new Date()) {
        voucher.status = "expired";
        await voucher.save();
        return res.status(400).json({
          success: false,
          error: "Voucher has expired",
        });
      }

      // Mark voucher as redeemed
      voucher.status = "redeemed";
      await voucher.save();

      // Create transaction record
      const transaction = await Transaction.create({
        user: userId,
        voucher: voucher._id,
        type: "redeem",
        amount: 0,
      });

      res.status(200).json({
        success: true,
        message: "Voucher redeemed successfully",
        data: transaction,
      });
    } catch (err) {
      next(err);
    }
  },
];
