import { Router } from 'express';

import {
  getInvitationInfo,
  invite
} from '../controllers/invitation.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/send-invite', authMiddleware, invite);
router.get('/info', getInvitationInfo);
export default router;
