// validations/transactionValidations.js
const yup = require("yup");

// Purchase Validation
exports.purchaseSchema = yup.object().shape({
  voucherId: yup.string().required("Voucher ID is required"),
});

// Redeem Validation
exports.redeemSchema = yup.object().shape({
  voucherCode: yup.string().required("Voucher code is required"),
});

// Transaction History Validation (for query params)
exports.historySchema = yup.object().shape({
  type: yup
    .string()
    .oneOf(["purchase", "redeem", "all"], "Invalid transaction type"),
  limit: yup.number().positive().integer(),
  page: yup.number().positive().integer(),
});
