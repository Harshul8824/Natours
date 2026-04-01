require('dotenv').config({ path: './config.env' });
const Razorpay = require('razorpay');

async function testRzp() {
    try {
        console.log("Checking keys...");
        console.log("KEY_ID:", process.env.RAZORPAY_KEY_ID ? "Loaded" : "Missing");
        
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_invalid_placeholder_abcd1234',
            key_secret: process.env.RAZORPAY_KEY_SECRET || 'invalid_secret'
        });

        console.log("Creating mock order...");
        const order = await razorpay.orders.create({
            amount: 500 * 100,
            currency: 'INR',
            receipt: 'tour_test'
        });

        console.log("Success! Order API works. Response:", order);
    } catch (err) {
        console.log("Caught Error:", err);
    }
}
testRzp();
