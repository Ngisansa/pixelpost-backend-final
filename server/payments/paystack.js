// server/payments/paystack.js
const axios = require("axios");

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE = "https://api.paystack.co";

if (!PAYSTACK_SECRET) {
  console.warn("⚠️ PAYSTACK_SECRET_KEY is not set");
}

/**
 * Initialize Paystack payment
 * IMPORTANT:
 * - Amount must be in kobo (KES * 100)
 * - Currency MUST be KES for MPesa in Kenya
 */
async function initialize(email, amountKES) {
  const response = await axios.post(
    `${PAYSTACK_BASE}/transaction/initialize`,
    {
      email,
      amount: Math.round(Number(amountKES) * 100),
      currency: "KES",
      channels: ["card", "mobile_money"],
      metadata: {
        product: "PixelPost Credits",
      },
    },
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

/**
 * Verify Paystack transaction
 */
async function verify(reference) {
  const response = await axios.get(
    `${PAYSTACK_BASE}/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET}`,
      },
    }
  );

  return response.data;
}

module.exports = {
  initialize,
  verify,
};
