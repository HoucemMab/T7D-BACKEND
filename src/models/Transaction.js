// models/Transaction.js
const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  voucher: {
    type: mongoose.Schema.ObjectId,
    ref: "Voucher",
    required: true,
  },
  type: {
    type: String,
    enum: ["purchase", "redeem"],
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Ensure user and voucher references are valid
TransactionSchema.pre("save", async function (next) {
  try {
    const user = await mongoose.model("User").findById(this.user);
    if (!user) {
      throw new Error("Invalid user reference");
    }

    const voucher = await mongoose.model("Voucher").findById(this.voucher);
    if (!voucher) {
      throw new Error("Invalid voucher reference");
    }

    next();
  } catch (err) {
    next(err);
  }
});

module.exports = mongoose.model("Transaction", TransactionSchema);
