import { NextFunction, Request, Response } from 'express';
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const userWallet = require("../models/userWallet.model")

const handlePayout = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { amount } = req.body;
        // substract the payout amount from the user's balance
        const user = req.route.meta.user;
        const wallet = await userWallet.findOne({user:user._id})
        if(wallet.balance <amount){
            return res.status(403).json({error:"Insufficient funds"});
        }
        wallet.balance -= amount;
        await wallet.save

        // initiate a payout to the user's connected stripe account
        const payout = await stripe.payouts.create({
            amount: amount * 100,
            currency: 'usd',
            destination: wallet.stripeCustomId,
        });
        res.json({ message: 'Payout Initiated', payout });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Payout failed' });
    }
};
const handlePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { amount } = req.body;

        // create PaymentIntent using stripe  for enhanced security and flexibility in payment processing
        const PaymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, //convert amount to cents
            currency: 'usd',
            payment_method: req.body.stripeToken,
            confirm: true,
        });
        const user = req.route.meta.user;

        const wallet = await userWallet.findOne({user:user._id})
        // update user balance after successful payment
        wallet.balance += amount;
        await wallet.save();

        res.json({ message: 'Payment successful', PaymentIntent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Payment failed' });
    }
};


module.exports = {
    handlePayout,
    handlePayment
};