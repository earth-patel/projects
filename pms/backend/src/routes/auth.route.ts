import { Router } from 'express';

import {
  login,
  me,
  register,
  verifyEmail
} from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authMiddleware, me);
router.get('/verify-email', verifyEmail);

export default router;
