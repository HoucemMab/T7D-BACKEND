const cron = require("node-cron");
const Voucher = require("./../models/Voucher");
// Schedule a task to run at 00:00 (midnight) every day
cron.schedule("0 0 * * *", async () => {
  try {
    // Find all vouchers that have expired
    const expiredVouchers = await Voucher.find({
      expiryDate: { $lt: new Date() },
      status: { $ne: "expired" }, // different from expired
    });

    // Update the status of expired vouchers to 'expired'
    if (expiredVouchers.length > 0) {
      await Voucher.updateMany(
        { _id: { $in: expiredVouchers.map((v) => v._id) } },
        { $set: { status: "expired" } }
      );

      console.log(
        `${expiredVouchers.length} vouchers have been marked as expired.`
      );
    } else {
      console.log("No expired vouchers found.");
    }
  } catch (err) {
    console.error("Error updating expired vouchers:", err);
  }
});
