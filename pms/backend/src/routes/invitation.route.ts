import { Router } from 'express';

import {
  acceptInvitation,
  getInvitationInfo,
  invite
} from '../controllers/invitation.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/permission.middleware';

const router = Router();

router.post(
  '/send-invite',
  authMiddleware,
  requireRole(['OWNER', 'ADMIN']),
  invite
);
router.get('/info', getInvitationInfo);
router.post('/accept-invite', authMiddleware, acceptInvitation);
export default router;
