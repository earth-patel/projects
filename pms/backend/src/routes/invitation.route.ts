import { Router } from 'express';

import {
  acceptInvitation,
  getInvitationInfo,
  invite
} from '../controllers/invitation.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

router.post('/send-invite', authMiddleware, invite);
router.get('/info', getInvitationInfo);
router.post('/accept', authMiddleware, acceptInvitation)
export default router;
