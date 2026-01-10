const express = require("express");
const router = express.Router();

const paystack = require("../payments/paystack");
const paypal = require("../payments/paypal");

const paystackWebhook = require("../payments/paystackWebhook");
const paypalWebhook = require("../payments/paypalWebhook");

const credits = require("../config/credits");
const User = require("../models/user");

/* =========================
   PAYSTACK (KES + MPESA)
========================= */

/**
 * INIT PAYSTACK PAYMENT BY CREDIT TIER
 * Body: { email, tier }
 */
router.post("/paystack/init", async (req, res) => {
  try {
    const { email, tier } = req.body;

    if (!email || !tier) {
      return res.status(400).json({ error: "email and tier are required" });
    }

    if (!credits.KES[tier]) {
      return res.status(400).json({ error: "Invalid credit tier" });
    }

    const pack = credits.KES[tier];

    const data = await paystack.initialize(email, pack.price);

    res.json({
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
      tier,
      credits: pack.credits,
      amountKES: pack.price,
    });
  } catch (err) {
    console.error("❌ Paystack init error:", err.message);
    res.status(500).json({ error: "Paystack init failed" });
  }
});

/**
 * VERIFY PAYSTACK PAYMENT (OPTIONAL – frontend use)
 */
router.get("/paystack/verify/:ref", async (req, res) => {
  try {
    const data = await paystack.verify(req.params.ref);
    res.json(data);
  } catch (err) {
    console.error("❌ Paystack verify error:", err.message);
    res.status(500).json({ error: "Verification failed" });
  }
});

/**
 * PAYSTACK WEBHOOK → ADD CREDITS
 */
router.post(
  "/paystack/webhook",
  express.json({ type: "*/*" }),
  async (req, res) => {
    try {
      const event = req.body;

      if (event.event !== "charge.success") {
        return res.sendStatus(200);
      }

      const email = event.data.customer.email;
      const amountKES = event.data.amount / 100;

      // Match credit tier by exact price
      const tier = Object.values(credits.KES).find(
        (t) => t.price === amountKES
      );

      if (!tier) {
        console.warn("⚠️ No matching credit tier for", amountKES);
        return res.sendStatus(200);
      }

      const user = await User.findOneAndUpdate(
        { email },
        { $inc: { credits: tier.credits } },
        { upsert: true, new: true }
      );

      console.log(
        `✅ Paystack: Added ${tier.credits} credits to ${email} (Total: ${user.credits})`
      );

      res.sendStatus(200);
    } catch (err) {
      console.error("❌ Paystack webhook error:", err);
      res.sendStatus(500);
    }
  }
);

/* =========================
   PAYPAL (USD – International)
========================= */

router.post("/paypal/create", paypal.createOrder);
router.post("/paypal/capture", paypal.captureOrder);

router.post(
  "/paypal/webhook",
  express.json({ type: "*/*" }),
  paypalWebhook
);

module.exports = router;
