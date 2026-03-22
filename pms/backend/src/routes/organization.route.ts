import { Router } from 'express';

import {
  createOrganization,
  listOrganizationMembers,
  listUserOrganizations,
  removeMember
} from '../controllers/organization.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/permission.middleware';

const router = Router();

router.get('/my-organizations', authMiddleware, listUserOrganizations);
router.post('/create-organization', authMiddleware, createOrganization);
router.get(
  '/:organizationId/members',
  authMiddleware,
  requireRole(['OWNER', 'ADMIN', 'MEMBER']),
  listOrganizationMembers
);
// OWNER and ADMIN can remove members (ADMIN restricted to MEMBERs only — checked in service)
router.delete(
  '/:organizationId/members/:userId',
  authMiddleware,
  requireRole(['OWNER', 'ADMIN']),
  removeMember
);
export default router;
