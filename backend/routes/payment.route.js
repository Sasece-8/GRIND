import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller.js';
import * as authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

router.post(
    '/create-payment-intent',
    authMiddleware.authUser,
    paymentController.createPaymentIntent
);

export default router;
