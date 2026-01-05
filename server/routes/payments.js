// PAYSTACK WEBHOOK
router.post('/paystack/webhook', express.json({ type: '*/*' }), async (req, res) => {
  try {
    const event = req.body;

    if (event.event === 'charge.success') {
      const reference = event.data.reference;
      const amountKES = event.data.amount / 100;
      const email = event.data.customer.email;

      console.log('✅ Paystack success:', { reference, amountKES, email });

      // TODO:
      // - credit user
      // - store transaction
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('❌ Paystack webhook error', err);
    res.sendStatus(500);
  }
});

// PAYPAL WEBHOOK
router.post('/paypal/webhook', express.json(), async (req, res) => {
  try {
    const event = req.body;

    if (event.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const amount = event.resource.amount.value;
      const currency = event.resource.amount.currency_code;

      console.log('✅ PayPal success:', { amount, currency });

      // TODO:
      // - credit user
      // - store transaction
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('❌ PayPal webhook error', err);
    res.sendStatus(500);
  }
});
