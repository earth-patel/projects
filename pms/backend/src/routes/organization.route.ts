import { Router } from 'express';

import {
  createOrganization,
  listOrganizationMembers,
  listUserOrganizations
} from '../controllers/organization.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/permission.middleware';

const router = Router();

router.get('/my-organizations', authMiddleware, listUserOrganizations);
router.post('/create-organization', authMiddleware, createOrganization);
router.get('/:organizationId/members', authMiddleware, requireRole(['OWNER', 'ADMIN', 'MEMBER']), listOrganizationMembers);
export default router;
