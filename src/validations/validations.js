// validations/voucherValidations.js
const yup = require("yup");

// User Registration Validation
exports.registerValidation = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  role: yup.string().oneOf(["user", "admin"], "Invalid role").default("user"),
});

// User Login Validation
exports.loginValidation = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
});

// Voucher Creation Validation
exports.voucherValidation = yup.object().shape({
  name: yup.string().required("Voucher name is required"),
  value: yup
    .number()
    .positive("Value must be positive")
    .required("Value is required"),
  expiryDate: yup
    .date()
    .min(new Date(), "Expiry date must be in the future")
    .required("Expiry date is required"),
});

// Voucher Update Validation
exports.voucherUpdateValidation = yup.object().shape({
  name: yup.string(),
  value: yup.number().positive("Value must be positive"),
  expiryDate: yup.date().min(new Date(), "Expiry date must be in the future"),
  status: yup
    .string()
    .oneOf(["active", "redeemed", "expired"], "Invalid status"),
});

// Purchase Voucher Validation
exports.purchaseValidation = yup.object().shape({
  voucherId: yup.string().required("Voucher ID is required"),
});

// Redeem Voucher Validation
exports.redeemValidation = yup.object().shape({
  voucherCode: yup.string().required("Voucher code is required"),
});
