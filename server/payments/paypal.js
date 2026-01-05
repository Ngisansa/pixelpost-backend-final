// server/payments/paypal.js
const axios = require("axios");

const PAYPAL_CLIENT = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_API = "https://api-m.paypal.com";

/**
 * Get PayPal access token
 */
async function getToken() {
  const res = await axios.post(
    `${PAYPAL_API}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      auth: {
        username: PAYPAL_CLIENT,
        password: PAYPAL_SECRET,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return res.data.access_token;
}

/**
 * Create PayPal order
 */
async function createOrder(req, res) {
  try {
    const token = await getToken();
    const { amountUSD } = req.body;

    const order = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: Number(amountUSD).toFixed(2),
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(order.data);
  } catch (err) {
    console.error("❌ PayPal create:", err.message);
    res.status(500).json({ error: "PayPal create failed" });
  }
}

/**
 * Capture PayPal order
 */
async function captureOrder(req, res) {
  try {
    const token = await getToken();
    const { orderID } = req.body;

    const capture = await axios.post(
      `${PAYPAL_API}/v2/checkout/orders/${orderID}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json(capture.data);
  } catch (err) {
    console.error("❌ PayPal capture:", err.message);
    res.status(500).json({ error: "PayPal capture failed" });
  }
}

module.exports = {
  createOrder,
  captureOrder,
};
