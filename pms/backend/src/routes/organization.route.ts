import { Router } from 'express';

import {
  createOrganization,
  listOrganizationMembers,
  listUserOrganizations,
  removeMember,
  updateMemberRole
} from '../controllers/organization.controller';
import {
  createOrgProject,
  deleteOrgProject,
  listOrgProjects
} from '../controllers/project.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/permission.middleware';

const router = Router();

/* ---------- ORGANIZATIONS ---------- */
router.get('/my-organizations', authMiddleware, listUserOrganizations);
router.post('/create-organization', authMiddleware, createOrganization);

/* ---------- MEMBERS ---------- */
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
// Only OWNER can change member roles
router.put(
  '/:organizationId/members/:userId/role',
  authMiddleware,
  requireRole(['OWNER']),
  updateMemberRole
);
export default router;

/* ---------- PROJECTS ---------- */
router.get(
  '/:organizationId/projects',
  authMiddleware,
  requireRole(['OWNER', 'ADMIN', 'MEMBER']),
  listOrgProjects
);
router.post(
  '/:organizationId/projects',
  authMiddleware,
  requireRole(['OWNER', 'ADMIN']),
  createOrgProject
);
router.delete(
  '/:organizationId/projects/:projectId',
  authMiddleware,
  requireRole(['OWNER', 'ADMIN']),
  deleteOrgProject
);
