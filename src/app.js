require("dotenv").config();
require("./crons/voucherCron");
const express = require("express");
const app = express();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const voucherRoutes = require("./routes/voucherRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

// Middlewares
app.use(express.json());
connectDB();
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/vouchers", voucherRoutes);
app.use("/api/transactions", transactionRoutes);

module.exports = app;
