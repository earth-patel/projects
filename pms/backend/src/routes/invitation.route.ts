import { Router } from 'express';

import { invite } from '../controllers/invitation.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/send', authMiddleware, invite);
export default router;
