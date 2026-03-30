import { Router } from 'express';
import { isLoggedIn } from '../middlewares/authMiddleware.js';
import {
  getRozorpayApiKey,
  buySubscription,
  verifySubscription,
  unsubscribe,
  allPayment
} from '../controllers/paymentController.js';

const router = Router();

router.get('/razorpay-key', isLoggedIn, getRozorpayApiKey);

router.post('/subscribe', isLoggedIn, buySubscription);

router.post('/verify', isLoggedIn, verifySubscription);

router.post('/unsubscribe', isLoggedIn, unsubscribe);

router.get('/', isLoggedIn, allPayment);

export default router;