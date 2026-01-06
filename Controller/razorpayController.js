const crypto = require('crypto');
const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');

exports.razorpayWebhook = (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const signature = req.headers['x-razorpay-signature'];

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  // 1) Verify webhook
  if (signature !== expectedSignature) {
    return res.status(400).send('Invalid signature');
  }

  // 2) Read event
  const event = req.body.event;

  // ✅ THIS IS WHERE YOUR CODE GOES
  if (event === 'payment.captured') {
    const payment = req.body.payload.payment.entity;

    const tourId = payment.notes.tourId;
    const userId = payment.notes.userId;
    const price = payment.amount / 100;

    // 3) Create booking
    Booking.create({
      tour: tourId,
      user: userId,
      price
    });
  }

  res.status(200).json({ status: 'success' });
};
