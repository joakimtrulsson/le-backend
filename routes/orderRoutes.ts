import express from 'express';
const router = express.Router();

import { webhookCheckout, getCheckoutSession } from '../controllers/orderController';

router.post('/checkout-session/', getCheckoutSession);

module.exports = router;
