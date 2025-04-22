// controllers/authController.js
const User = require("../models/User");
const {
  registerValidation,
  loginValidation,
} = require("../validations/validations");
const { validate } = require("../middlewares/validate");

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = [
  //validate(registerValidation),
  async (req, res, next) => {
    try {
      const { name, email, password, role } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, error: "Email already in use" });
      }

      // Create user
      const user = await User.create({ name, email, password, role });

      // Create token
      const token = user.getSignedJwtToken();

      res.status(201).json({ success: true, token });
    } catch (err) {
      console.error(err);
      next(err);
    }
  },
];

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = [
  validate(loginValidation),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Check for user
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return res
          .status(401)
          .json({ success: false, error: "Invalid credentials" });
      }

      // Check if password matches
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, error: "Invalid credentials" });
      }

      // Create token
      const token = user.getSignedJwtToken();

      res.status(200).json({ success: true, token });
    } catch (err) {
      next(err);
    }
  },
];
