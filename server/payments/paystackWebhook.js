// server/payments/paystackWebhook.js
const crypto = require("crypto");
const User = require("../models/user");

module.exports = async function paystackWebhook(req, res) {
  const secret = process.env.PAYSTACK_SECRET_KEY;

  // Verify Paystack signature
  const hash = crypto
    .createHmac("sha512", secret)
    .update(JSON.stringify(req.body))
    .digest("hex");

  if (hash !== req.headers["x-paystack-signature"]) {
    return res.status(401).send("Invalid signature");
  }

  const event = req.body;

  if (event.event === "charge.success") {
    const email = event.data.customer.email;
    const amountKES = event.data.amount / 100;

    // Credit tiers (KES)
    const credits =
      amountKES >= 5000 ? 120 :
      amountKES >= 2000 ? 40 :
      amountKES >= 500  ? 10 : 0;

    if (credits > 0) {
      await User.findOneAndUpdate(
        { email },
        { $inc: { credits } },
        { upsert: true, new: true }
      );
    }
  }

  res.sendStatus(200);
};
