// server/routes/payments.js
const express = require("express");
const router = express.Router();

const paystack = require("../payments/paystack");
const paypal = require("../payments/paypal");

/* =======================
   PAYSTACK INIT
======================= */
router.post("/paystack/init", async (req, res) => {
  try {
    const { email, amount } = req.body;

    if (!email || !amount) {
      return res.status(400).json({ error: "email and amount required" });
    }

    const result = await paystack.initialize(email, amount);
    res.json(result);
  } catch (err) {
    console.error("❌ Paystack init:", err);
    res.status(500).json({ error: "Paystack init failed" });
  }
});

/* =======================
   PAYSTACK VERIFY
======================= */
router.get("/paystack/verify/:reference", async (req, res) => {
  try {
    const result = await paystack.verify(req.params.reference);
    res.json(result);
  } catch (err) {
    console.error("❌ Paystack verify:", err);
    res.status(500).json({ error: "Verification failed" });
  }
});

/* =======================
   PAYSTACK WEBHOOK
======================= */
router.post(
  "/paystack/webhook",
  express.json({ type: "*/*" }),
  async (req, res) => {
    try {
      if (req.body?.event === "charge.success") {
        console.log("✅ Paystack webhook:", req.body.data.reference);
        // credit increment comes next
      }
      res.sendStatus(200);
    } catch (err) {
      console.error("❌ Webhook error:", err);
      res.sendStatus(500);
    }
  }
);

/* =======================
   PAYPAL
======================= */
router.post("/paypal/create", paypal.createOrder);
router.post("/paypal/capture", paypal.captureOrder);

module.exports = router;
