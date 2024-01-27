const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const express = require('express');

const handlePayment = async (req, res) => {
    try {
        const { amount } = req.body;

        // create PaymentIntent using stripe  for enhanced security and flexibility in payment processing
        const PaymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, //convert amount to cents
            currency: 'usd',
            payment_method: req.body.stripeToken,
            confirm: true,
        });

        // update user balance after successful payment
        req.user.balance += amount;
        await req.user.save();

        res.json({ message: 'Payment successful', PaymentIntent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Payment failed' });
    }
};

module.exports = {
    handlePayment
};

