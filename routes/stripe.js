const express = require('express');
const router = express.Router();
const handlePayment = require('../controllers/payment.js');
const handlePayout = require('../controllers/payout.js');
const auth = require('../middleware/auth.js');

router.post('/payment', auth, handlePayment.handlePayment);
router.post('/payout', auth, handlePayout.handlePayout);

module.exports = router;