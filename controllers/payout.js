const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const handlePayout = async (req, res) => {
    try {
        const { amount } = req.body;
        // substract the payout amount from the user's balance
        req.user.balance -= amount;
        await req.user.save();

        // initiate a payout to the user's connected stripe account
        const payout = await stripe.payouts.create({
            amount: amount * 100,
            currency: 'usd',
            destination: req.user.stripeCustomId,
        });
        res.json({ message: 'Payout Initiated', payout });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Payout failed' });
    }
};

module.exports = {
    handlePayout
};