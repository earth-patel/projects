import { Router, type Response } from 'express';

import { register, login } from '../controllers/auth.controller';
import { authMiddleware, type AuthRequest } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// currently a test route to verify auth middleware
router.get('/me', authMiddleware, (req: AuthRequest, res: Response) => {
  res.json({
    message: 'You are authenticated',
    user: req.user
  });
});

export default router;