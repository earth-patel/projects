import { Router } from 'express';

import {
  forgotPassword,
  login,
  me,
  register,
  resendVerificationEmail,
  resetPassword,
  verifyEmail
} from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { loginLimiter } from '../middleware/rate-limit.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.get('/me', authMiddleware, me);
router.get('/verify-email', verifyEmail);
router.post('/resend-verification-email', resendVerificationEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
export default router;
