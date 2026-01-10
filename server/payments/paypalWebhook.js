module.exports = async function paypalWebhook(req, res) {
  const event = req.body;

  if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
    const email =
      event.resource?.payer?.email_address || "unknown";

    console.log("✅ PayPal payment confirmed");
    console.log(`User: ${email}`);

    // TODO: credit user account
  }

  res.sendStatus(200);
};
