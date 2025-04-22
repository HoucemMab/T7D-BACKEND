// controllers/voucherController.js
const Voucher = require("../models/Voucher");
const {
  createVoucherSchema,
  updateVoucherSchema,
  voucherCodeSchema,
} = require("../validations/validations");
const { validate } = require("../middlewares/validate");

// @desc    Create a voucher
// @route   POST /api/vouchers
// @access  Admin
exports.createVoucher = [
  //validate(createVoucherSchema),
  async (req, res, next) => {
    try {
      const { name, value, expiryDate } = req.body;

      const voucher = await Voucher.create({
        name,
        value,
        expiryDate,
      });

      res.status(201).json({
        success: true,
        data: voucher,
      });
    } catch (err) {
      if (err.code === 11000) {
        // Handle duplicate voucher code (extremely rare case)
        return res.status(400).json({
          success: false,
          error: "Voucher creation failed. Please try again.",
        });
      }
      next(err);
    }
  },
];

// @desc    Update a voucher
// @route   PUT /api/vouchers/:id
// @access  Admin
exports.updateVoucher = [
  validate(updateVoucherSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const voucher = await Voucher.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
      });

      if (!voucher) {
        return res.status(404).json({
          success: false,
          error: "Voucher not found",
        });
      }

      res.status(200).json({
        success: true,
        data: voucher,
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
  validate(voucherCodeSchema),
  async (req, res, next) => {
    try {
      const { code } = req.body;
      const userId = req.user.id; // Assuming user is attached to request via auth middleware

      const voucher = await Voucher.findOne({ code });

      if (!voucher) {
        return res.status(404).json({
          success: false,
          error: "Voucher not found",
        });
      }

      if (voucher.status !== "active") {
        return res.status(400).json({
          success: false,
          error: "Voucher is not active",
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

      // Update voucher status
      voucher.status = "redeemed";
      await voucher.save();

      res.status(200).json({
        success: true,
        data: voucher,
      });
    } catch (err) {
      next(err);
    }
  },
];
