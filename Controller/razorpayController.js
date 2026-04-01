const crypto = require('crypto');
const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');

exports.razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    // 1) Verify webhook
    // Note: If you receive signature verification errors in production, Razorpay docs
    // define verify validation via crypto crypto.timingSafeEqual or similar string matches
    if (signature !== expectedSignature) {
      return res.status(400).send('Invalid signature');
    }

    // 2) Read event
    const event = req.body.event;

    // ✅ THIS IS WHERE YOUR CODE GOES
    if (event === 'payment.captured' || event === 'order.paid') {
      const payment = req.body.payload.payment.entity;

      const tourId = payment.notes.tourId;
      const userId = payment.notes.userId;
      const price = payment.amount / 100;

      // 3) Create booking
      await Booking.create({
        tour: tourId,
        user: userId,
        price
      });
    }

    res.status(200).json({ status: 'success' });
  } catch (err) {
    res.status(400).json({ status: 'error', message: err.message });
  }
};
