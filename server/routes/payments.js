// server/routes/payments.js
const express = require("express");
const router = express.Router();

const paystack = require("../payments/paystack");
const paypal = require("../payments/paypal");

/* =====================================================
   PAYSTACK – INIT PAYMENT
===================================================== */
router.post("/paystack/init", async (req, res) => {
  try {
    const { email, amount } = req.body;

    if (!email || !amount) {
      return res.status(400).json({ error: "email and amount required" });
    }

    const response = await paystack.initialize(email, amount);
    res.json(response);
  } catch (err) {
    console.error("❌ Paystack init error:", err);
    res.status(500).json({ error: "Payment initialization failed" });
  }
});

/* =====================================================
   PAYSTACK – VERIFY PAYMENT
===================================================== */
router.get("/paystack/verify/:reference", async (req, res) => {
  try {
    const { reference } = req.params;
    const response = await paystack.verify(reference);
    res.json(response);
  } catch (err) {
    console.error("❌ Paystack verify error:", err);
    res.status(500).json({ error: "Payment verification failed" });
  }
});

/* =====================================================
   PAYSTACK – WEBHOOK
   (KES + MPesa compatible)
===================================================== */
router.post(
  "/paystack/webhook",
  express.json({ type: "*/*" }),
  async (req, res) => {
    try {
      const event = req.body;

      if (event.event === "charge.success") {
        const data = event.data;

        console.log("✅ Paystack webhook received:", data.reference);

        // TODO (next step):
        // 1. Find user by email
        // 2. Increment credits
        // 3. Store transaction
      }

      res.sendStatus(200);
    } catch (err) {
      console.error("❌ Paystack webhook error:", err);
      res.sendStatus(500);
    }
  }
);

/* =====================================================
   PAYPAL
===================================================== */
router.post("/paypal/create", paypal.createOrder);
router.post("/paypal/capture", paypal.captureOrder);

module.exports = router;
